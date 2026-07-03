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

        length = length.trim();

        if (length.includes("'")) return length;

        const parts = length.split(".");

        if (parts.length === 2) {
            return `${parts[0]}'${parts[1]}"`;
        }

        return length;

    }

    function updateInput(selector, value) {

        const input = document.querySelector(selector);

        if (!input) return;

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

            console.log("Auto Filled:", measurement);

        }
        finally {

            isUpdating = false;

        }

    }

    function observeDropdown(dropdown) {

        const valueNode =
            dropdown.querySelector(".dropdown-button__value");

        if (!valueNode) return;

        let lastValue =
            valueNode.textContent.trim();

        const observer =
            new MutationObserver(() => {

                const current =
                    valueNode.textContent.trim();

                if (
                    current === lastValue ||
                    current === "" ||
                    current === "-- Please select --"
                ) {
                    return;
                }

                lastValue = current;

                parseMeasurement(current);

            });

        observer.observe(valueNode, {
            subtree: true,
            childList: true,
            characterData: true
        });

    }

    document
        .querySelectorAll(".gpo-dropdown")
        .forEach(observeDropdown);

});