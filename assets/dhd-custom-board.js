document.addEventListener("DOMContentLoaded", () => {

    console.log("BGS DHD Custom Board Loaded");

    const selectors = {
        model: 'input[name="dhd-model"]',
        construction: 'input[name="cdhd-construction"]',
        length: "#text-1",
        width: "#text-2",
        thickness: "#text-3",
        volume: "#text-4"
    };

    function getSelectedModel() {
        return document.querySelector('input[name="dhd-model"]:checked')?.value ?? null;
    }

    function getSelectedConstruction() {
        return document.querySelector('input[name="cdhd-construction"]:checked')?.value ?? null;
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

    function parseRecommendedSize(size) {

        if (!size) return null;

        const parts = size.split("–");

        if (parts.length !== 2) return null;

        const dimensions = parts[0]
            .split("×")
            .map(item => item.trim());

        if (dimensions.length !== 3) return null;

        return {
            length: dimensions[0],
            width: dimensions[1],
            thickness: dimensions[2],
            volume: parts[1].replace("L", "").trim()
        };

    }

    function populateBoardDimensions(size) {

        if (!size) return;

        const data = parseRecommendedSize(size);

        if (!data) return;

        updateInput(selectors.length, data.length);
        updateInput(selectors.width, data.width);
        updateInput(selectors.thickness, data.thickness);
        updateInput(selectors.volume, data.volume);

    }

    function getBoardLength() {

        const input = document.querySelector(selectors.length);

        if (!input) return null;

        const value = input.value.trim();

        let feet = 0;
        let inches = 0;

        if (value.includes(".")) {

            const parts = value.split(".");

            feet = parseInt(parts[0], 10);
            inches = parseInt(parts[1], 10) || 0;

        } else {

            feet = parseInt(value, 10);

        }

        return {

            feet,
            inches,

            isUpTo66() {
                return feet < 6 || (feet === 6 && inches <= 6);
            }

        };

    }

    function getBasePriceOption() {

        const model = getSelectedModel();
        const construction = getSelectedConstruction();
        const length = getBoardLength();

        if (!construction || !length) return null;

        if (model && model.includes("JNR")) {
            return "Junior";
        }

        if (construction === "PU") {
            return length.isUpTo66()
                ? "PU - Up to 6.6.5"
                : "PU - 6.7-7.2";
        }

        if (construction === "EPS Stringered") {
            return length.isUpTo66()
                ? "EPS Stringered - Up to 6.6.5"
                : "EPS Stringered - 6.7-7.0";
        }

        return null;

    }

    function updateBasePrice() {

        const value = getBasePriceOption();

        if (!value) return;

        const option = document.querySelector(
            `input[name="cdhd-baseprice"][value="${value}"]`
        );

        if (!option || option.checked) return;

        option.click();

    }

    document.addEventListener("change", (e) => {

    const lengthInput = document.querySelector(selectors.length);

    if (lengthInput) {

        lengthInput.addEventListener("input", updateBasePrice);
        lengthInput.addEventListener("change", updateBasePrice);
        lengthInput.addEventListener("blur", updateBasePrice);

    }

        if (
            e.target.matches(
                'input[data-type="dropdown"][data-field-name$="-size"]'
            )
        ) {

            populateBoardDimensions(e.target.value);
            updateBasePrice();

            return;

        }

        if (e.target.matches('input[name="cdhd-construction"]')) {

            updateBasePrice();

            return;

        }

    });

});