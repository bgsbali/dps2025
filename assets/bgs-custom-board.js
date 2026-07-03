document.addEventListener("DOMContentLoaded", () => {

    const selectors = {
        length: "#text-1",
        width: "#text-2",
        thickness: "#text-3",
        volume: "#text-4"
    };

    let isUpdating = false;

    function convertLength(length) {

        length = length.trim();

        if (length.includes("'")) return length;

        const parts = length.split(".");

        if (parts.length === 2) {
            return `${parts[0]}'${parts[1]}"`;
        }

        return length;

    }

    function normalizeVolume() {

        const volumeInput = document.querySelector(selectors.volume);

        if (!volumeInput) return;

        let value = volumeInput.value.trim();

        value = value.replace(/l/gi, "").trim();

        if (value === "") {
            volumeInput.value = "";
            return;
        }

        volumeInput.value = value + "L";

    }

    function updateInput(selector, value) {

        const input = document.querySelector(selector);

        if (!input) return;

        if (selector === selectors.volume) {
            value = value.replace(/l/gi, "").trim() + "L";
        }

        if (input.value === value) return;

        input.value = value;

        input.dispatchEvent(new Event("input", {
            bubbles: true
        }));

        input.dispatchEvent(new Event("change", {
            bubbles: true
        }));

    }

    function parseMeasurement(measurement) {

        if (isUpdating) return;

        isUpdating = true;

        try {

            const parts = measurement
                .split(/\s*x\s*/i)
                .map(p => p.trim());

            if (parts.length !== 4) return;

            updateInput(
                selectors.length,
                convertLength(parts[0])
            );

            updateInput(
                selectors.width,
                parts[1]
            );

            updateInput(
                selectors.thickness,
                parts[2]
            );

            updateInput(
                selectors.volume,
                parts[3]
            );

            updateBasePrice();

        } finally {

            isUpdating = false;

        }

    }

    /**
     * ==========================================
     * AUTO BASE PRICE
     * ==========================================
     */

    function updateBasePrice() {

        const length =
            document.querySelector(selectors.length)?.value.trim();

        if (!length) return;

        const construction =
            document.querySelector(
                'input[name="cp-construction"]:checked'
            )?.value;

        if (!construction) return;

        const fin =
            document.querySelector(
                'input[name="cp-finlayout"]:checked'
            )?.value;

        if (!fin) return;

        const feet = parseInt(length);

        const size = feet < 7
            ? "Under 7"
            : "7-8";

        let targetValue;

        if (
            construction === "EPS Full Carbon Vacuum" ||
            construction === "EPS Full Carbon Resin Inject"
        ) {

            targetValue =
                `${construction} - ${fin.replace(" Fins", "-Fin")}`;

        } else {

            targetValue =
                `${construction} - ${size} - ${fin.replace(" Fins", "-Fin")}`;

        }

        const option = document.querySelector(
            `input[name="cp-baseprice"][value="${targetValue}"]`
        );

        if (!option) return;

        if (option.checked) return;

        option.click();

    }

    /**
     * ==========================================
     * GLOBAL CHANGE LISTENER
     * ==========================================
     */

    document.addEventListener("change", function (e) {

        if (
            e.target.matches(
                'input[data-type="dropdown"][data-field-name$="-size"]'
            )
        ) {

            parseMeasurement(e.target.value);

            return;

        }

        if (
            e.target.matches(
                'input[name="cp-construction"]'
            )
        ) {

            updateBasePrice();

            return;

        }

        if (
            e.target.matches(
                'input[name="cp-finlayout"]'
            )
        ) {

            updateBasePrice();

            return;

        }

        if (
            e.target.matches(selectors.volume) &&
            !isUpdating
        ) {

            normalizeVolume();

        }

    });

    /**
     * ==========================================
     * VOLUME
     * ==========================================
     */

    const volumeInput = document.querySelector(selectors.volume);

    if (volumeInput) {

        volumeInput.addEventListener("blur", normalizeVolume);

        volumeInput.addEventListener("focus", function () {

            normalizeVolume();

            const pos = this.value.length - 1;

            this.setSelectionRange(pos, pos);

        });

        normalizeVolume();

    }

});