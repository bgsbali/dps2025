document.addEventListener("DOMContentLoaded", () => {

    console.log("BGS Custom Board Loaded");

    const selectors = {
        length: "#text-1",
        width: "#text-2",
        thickness: "#text-3",
        volume: "#text-4"
    };

    let isUpdating = false;

    function convertLength(length) {

        if (!length) return "";

        length = length
            .replace(/[’′]/g, "'")
            .replace(/[“”]/g, '"')
            .trim();

        if (length.includes("'")) return length;

        const parts = length.split(".");

        if (parts.length === 2) {
            return `${parts[0]}'${parts[1]}"`;
        }

        return length;

    }

    function normalizeVolume(value) {

        return value
            .replace(/l/gi, "")
            .trim() + "L";

    }

    function updateInput(selector, value) {

        const input = document.querySelector(selector);

        if (!input) return;

        if (selector === selectors.volume) {
            value = normalizeVolume(value);
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

    function parseMeasurement(text) {

        if (isUpdating) return;

        if (!text || text === "Custom") return;

        isUpdating = true;

        try {

            text = text
                .replace(/[’′]/g, "'")
                .replace(/[“”]/g, '"')
                .trim();

            let length = "";
            let width = "";
            let thickness = "";
            let volume = "";

            // Format:
            // 5.10 x 19 x 2 1/2 x 29L

            let match = text.match(/^(.+?)\s*x\s*(.+?)\s*x\s*(.+?)\s*x\s*(.+)$/i);

            // Format:
            // 5.10 x 19 3/4 x 2 3/4 - 38.30L

            if (!match) {
                match = text.match(/^(.+?)\s*x\s*(.+?)\s*x\s*(.+?)\s*-\s*(.+)$/i);
            }

            // Format:
            // 5'8 - 18 1/2 x 2 1/4 / 25L

            if (!match) {
                match = text.match(/^(.+?)\s*-\s*(.+?)\s*x\s*(.+?)\s*\/\s*(.+)$/i);
            }

            if (!match) {
                console.log("Unknown Dimension:", text);
                return;
            }

            length = convertLength(match[1]);
            width = match[2].trim();
            thickness = match[3].trim();
            volume = match[4].trim();

            updateInput(selectors.length, length);
            updateInput(selectors.width, width);
            updateInput(selectors.thickness, thickness);
            updateInput(selectors.volume, volume);

            console.log("Auto Filled:", {
                length,
                width,
                thickness,
                volume
            });

        } finally {

            isUpdating = false;

        }

    }

    document.addEventListener("change", function(e) {

        const target = e.target;

        if (
            target.matches("select") &&
            /recommended dimension/i.test(
                target.closest(".gpo-element")
                    ?.querySelector("label .label-content")
                    ?.textContent || ""
            )
        ) {

            parseMeasurement(target.value);

            return;

        }

        if (
            target.matches(selectors.volume) &&
            !isUpdating
        ) {

            target.value = normalizeVolume(target.value);

        }

    });

    const observer = new MutationObserver(() => {

        document.querySelectorAll("select").forEach(select => {

            if (select.dataset.bgsBound) return;

            const label = select
                .closest(".gpo-element")
                ?.querySelector("label .label-content")
                ?.textContent || "";

            if (!/recommended dimension/i.test(label)) return;

            select.dataset.bgsBound = "1";

            select.addEventListener("change", function() {

                parseMeasurement(this.value);

            });

        });

    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

});