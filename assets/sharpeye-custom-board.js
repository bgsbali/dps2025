document.addEventListener("DOMContentLoaded", () => {

    console.log("BGS SharpEye Custom Board Loaded");

    const selectors = {
        model: 'input[name="cshp-model"]',
        construction: 'input[name="cshp-construction"]',
        length: "#text-1",
        width: "#text-2",
        thickness: "#text-3",
        volume: "#text-4"
    };


    function getSelectedModel() {

        return document.querySelector(
            selectors.model + ":checked"
        )?.value ?? null;

    }


    function getSelectedConstruction() {

        return document.querySelector(
            selectors.construction + ":checked"
        )?.value ?? null;

    }


    function updateInput(selector, value) {

        const input = document.querySelector(selector);

        if (!input) return;

        if (input.value === value) return;

        input.value = value;

        input.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );

        input.dispatchEvent(
            new Event("change", {
                bubbles: true
            })
        );

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
            volume: parts[1]
                .replace("L", "")
                .trim()
        };

    }


    function populateBoardDimensions(size) {

        if (!size) return;

        const data = parseRecommendedSize(size);

        if (!data) return;

        updateInput(
            selectors.length,
            data.length
        );

        updateInput(
            selectors.width,
            data.width
        );

        updateInput(
            selectors.thickness,
            data.thickness
        );

        updateInput(
            selectors.volume,
            data.volume
        );

    }


    function getBoardLength() {

        const input = document.querySelector(
            selectors.length
        );

        if (!input) return null;

        const value = input.value
            .trim()
            .replace(/['"]/g, "");

        if (!value) return null;

        const parts = value.split(".");

        const feet = parseInt(parts[0], 10);

        if (isNaN(feet)) return null;

        const inches =
            parts.length > 1
                ? parseInt(parts[1], 10) || 0
                : 0;

        return {
            feet,
            inches
        };

    }


    function getLengthTier() {

        const length = getBoardLength();

        if (!length) return null;

        const {
            feet,
            inches
        } = length;


        if (
            feet < 5 ||
            (feet === 5 && inches <= 6)
        ) {

            return "up-to-5-6";

        }


        if (
            (feet === 5 && inches >= 8) ||
            (feet === 6 && inches <= 5)
        ) {

            return "5-8-to-6-5";

        }


        if (
            (feet === 6 && inches >= 6) ||
            (feet === 7 && inches <= 1)
        ) {

            return "6-6-to-7-1";

        }


        if (
            (feet === 7 && inches >= 2) ||
            feet === 8
        ) {

            return "7-2-to-8-0";

        }

        return null;

    }


function getBasePriceOption() {

    const construction = getSelectedConstruction();
    const length = getBoardLength();

    if (!construction || !length) return null;

    const feet = length.feet;
    const inches = length.inches;

    let tier = null;

    // Up to 5'6"
    if (
        feet < 5 ||
        (feet === 5 && inches <= 6)
    ) {
        tier = "Up to 5.6";
    }

    // 5'8" - 6'5"
    else if (
        (feet === 5 && inches >= 8) ||
        (feet === 6 && inches <= 5)
    ) {
        tier = "5.8 to 6.5";
    }

    // 6'6" - 7'1"
    else if (
        (feet === 6 && inches >= 6) ||
        (feet === 7 && inches <= 1)
    ) {
        tier = "6.6 to 7.1";
    }

    // 7'2" - 8'0"
    else if (
        (feet === 7 && inches >= 2) ||
        feet === 8
    ) {
        tier = "7.2 to 8.0";
    }

    if (!tier) return null;

    return `${construction} - ${tier}`;

}


    function updateBasePrice() {

        const value =
            getBasePriceOption();

        if (!value) return;

        const option = document.querySelector(
            `input[name="cshp-baseprice"][value="${value}"]`
        );

        if (!option) {

            console.warn(
                "SharpEye Base Price option not found:",
                value
            );

            return;

        }

        if (option.checked) return;

        option.click();

    }


    function bindLengthEvents() {

        const lengthInput =
            document.querySelector(
                selectors.length
            );

        if (!lengthInput) return;

        lengthInput.addEventListener(
            "input",
            updateBasePrice
        );

        lengthInput.addEventListener(
            "change",
            updateBasePrice
        );

        lengthInput.addEventListener(
            "blur",
            updateBasePrice
        );

    }


    document.addEventListener(
        "change",
        (e) => {

            if (
                e.target.matches(
                    'input[data-type="dropdown"][data-field-name$="-size"]'
                )
            ) {

                populateBoardDimensions(
                    e.target.value
                );

                updateBasePrice();

                return;

            }


            if (
                e.target.matches(
                    selectors.construction
                )
            ) {

                updateBasePrice();

                return;

            }

        }
    );


    bindLengthEvents();

    updateBasePrice();

});