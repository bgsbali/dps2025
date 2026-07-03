document.addEventListener("DOMContentLoaded", () => {

    const selectors = {
        length: "#text-1",
        width: "#text-2",
        thickness: "#text-3",
        volume: "#text-4"
    };

    function convertLength(length) {
        length = length.trim();

        if (length.includes("'")) return length;

        const parts = length.split(".");

        if (parts.length === 2) {
            return `${parts[0]}'${parts[1]}"`;
        }

        return length;
    }

    function setInput(selector, value) {

        const input = document.querySelector(selector);

        if (!input) return;

        input.value = value;

        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));

    }

    function parseMeasurement(measurement) {

        if (!measurement) return;

        const parts = measurement
            .split(/\s*x\s*/i)
            .map(v => v.trim());

        if (parts.length !== 4) return;

        setInput(selectors.length, convertLength(parts[0]));
        setInput(selectors.width, parts[1]);
        setInput(selectors.thickness, parts[2]);
        setInput(selectors.volume, parts[3]);

        console.log("Measurement synced:", measurement);

    }

    function watchDropdown(dropdown) {

        const valueElement = dropdown.querySelector(".dropdown-button__value");

        if (!valueElement) return;

        let previous = valueElement.textContent.trim();

        const observer = new MutationObserver(() => {

            const current = valueElement.textContent.trim();

            if (
                current !== previous &&
                current !== "-- Please select --" &&
                current !== ""
            ) {

                previous = current;

                parseMeasurement(current);

            }

        });

        observer.observe(valueElement, {
            childList: true,
            subtree: true,
            characterData: true
        });

    }

    document
        .querySelectorAll(".gpo-dropdown")
        .forEach(watchDropdown);

});