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

        return parts.length === 2
            ? `${parts[0]}'${parts[1]}"`
            : length;

    }

    function normalizeVolume() {

        const volumeInput = document.querySelector(selectors.volume);

        if (!volumeInput) return;

        const value = volumeInput.value
            .trim()
            .replace(/l/gi, "")
            .trim();

        volumeInput.value = value ? `${value}L` : "";

    }

    function updateInput(selector, value) {

        const input = document.querySelector(selector);

        if (!input) return;

        if (selector === selectors.volume) {
            value = `${value.replace(/l/gi, "").trim()} L`;
        }

        if (input.value === value) return;

        input.value = value;

        ["input", "change"].forEach(event =>
            input.dispatchEvent(
                new Event(event, { bubbles: true })
            )
        );

    }

    function parseMeasurement(measurement) {

        if (isUpdating) return;

        isUpdating = true;

        try {

            const parts = measurement
                .split(/\s*x\s*/i)
                .map(part => part.trim());

            if (parts.length !== 4) return;

            updateInput(selectors.length, convertLength(parts[0]));
            updateInput(selectors.width, parts[1]);
            updateInput(selectors.thickness, parts[2]);
            updateInput(selectors.volume, parts[3]);

            updateBasePrice();

        } finally {

            isUpdating = false;

        }

    }

    function getPricingFinLayout(fin) {

        switch (fin) {

            case "Single Fin":
            case "Twin Fins":
            case "Thruster (3 Fins)":
                return "3 Fins";

            case "Quad (4 Fins)":
            case "2 + 1 Single Fin":
            case "5 Fins":
                return "5 Fins";

            default:
                return fin;

        }

    }

    function clickBasePrice(selector) {

        const option = document.querySelector(selector);

        if (!option || option.checked) return false;

        option.click();

        return true;

    }

    function updateBasePrice() {

        const length = document.querySelector(selectors.length)?.value.trim();
        if (!length) return;

        const model = document.querySelector('input[name="model"]:checked')?.value;
        if (!model) return;

        const construction = document.querySelector('input[name="cp-construction"]:checked')?.value;
        if (!construction) return;

        const selectedFin = document.querySelector('input[name="cp-finlayout"]:checked')?.value;
        if (!selectedFin) return;

        const fin = getPricingFinLayout(selectedFin);

        const feet = parseFloat(
            length
                .replace("'", ".")
                .replace('"', "")
                .trim()
        );

        if (model === "Gromlin") {

            const price =
                construction === "Poly"
                    ? (fin === "3 Fins" ? "9650000" : "9950000")
                    : (fin === "3 Fins" ? "11300000" : "11650000");

            clickBasePrice(
                `input[name="cp-baseprice"][data-addon-price="${price}"]`
            );

            return;

        }

        if (model === "Wildcat Twin") {

            if (feet >= 7) return;

            let targetValue = "";

            switch (construction) {

                case "Poly":
                    targetValue = "Wildcat Twin Poly";
                    break;

                case "EPS":
                    targetValue = "Wildcat Twin EPS";
                    break;

                case "EPS Full Carbon Resin Inject":
                    targetValue = "Wildcat Twin EPS Full Carbon Resin Inject";
                    break;

                default:
                    return;

            }

            clickBasePrice(
                `input[name="cp-baseprice"][value="${targetValue}"]`
            );

            return;

        }

        if (
            model === "Mid-Length Crisis" &&
            construction === "Poly"
        ) {

            const targetValue =
                feet < 7
                    ? "Mid-Length Crisis Under 7"
                    : "Mid-Length Crisis 7-8";

            clickBasePrice(
                `input[name="cp-baseprice"][value="${targetValue}"]`
            );

            return;

        }

        if (
            model === "Padillac" &&
            construction === "Poly"
        ) {

            let targetValue = "";

            if (feet < 8) {

                targetValue = "Padillac Poly 7-7.11";

            } else if (feet < 9) {

                targetValue = "Padillac Poly 8-8.11";

            } else {

                targetValue = "Padillac Poly 9+";

            }

            clickBasePrice(
                `input[name="cp-baseprice"][value="${targetValue}"]`
            );

            return;

        }

        let size = "";

        if (feet < 7) {
            size = "Under 7";
        } else if (feet < 9) {
            size = "7-8";
        } else {
            size = "Over 9";
        }

        if (size === "Over 9") {

            clickBasePrice(
                'input[name="cp-baseprice"][value="Over 9"]'
            );

            return;

        }

        const targetValue =
            (
                construction === "EPS Full Carbon Vacuum" ||
                construction === "EPS Full Carbon Resin Inject"
            )
                ? `${construction} - ${fin.replace(" Fins", "-Fin")}`
                : `${construction} - ${size} - ${fin.replace(" Fins", "-Fin")}`;

        clickBasePrice(
            `input[name="cp-baseprice"][value="${targetValue}"]`
        );

    }

    document.addEventListener("change", e => {

        if (
            e.target.matches(
                'input[data-type="dropdown"][data-field-name$="-size"]'
            )
        ) {

            parseMeasurement(e.target.value);
            return;

        }

        if (
            e.target.matches('input[name="model"]') ||
            e.target.matches('input[name="cp-construction"]') ||
            e.target.matches('input[name="cp-finlayout"]')
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

    const lengthInput = document.querySelector(selectors.length);

    if (lengthInput) {

        ["input", "blur"].forEach(event =>
            lengthInput.addEventListener(event, updateBasePrice)
        );

    }

});