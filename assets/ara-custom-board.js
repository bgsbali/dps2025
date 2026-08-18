document.addEventListener("DOMContentLoaded", () => {

    console.log("BGS Arakawa Custom Board Loaded");

    const selectors = {
        model: 'input[name="cara-model"]',
        length: "#text-1",
        width: "#text-2",
        thickness: "#text-3",
        volume: "#text-4"
    };


    function getSelectedModel() {

        return document.querySelector(
            `${selectors.model}:checked`
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

        if (!data) {

            console.warn(
                "Arakawa: Cannot parse Recommended Size:",
                size
            );

            return;

        }

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

        const value = input.value.trim();

        if (!value) return null;


        let feet = 0;
        let inches = 0;


        /*
         * Support:
         *
         * 6
         * 6.0
         * 6.6
         * 6.10
         * 6'0
         * 6'6
         */


        if (value.includes("'")) {

            const parts = value.split("'");

            feet = parseInt(
                parts[0],
                10
            );

            inches = parseInt(
                parts[1],
                10
            ) || 0;

        }

        else if (value.includes(".")) {

            const parts = value.split(".");

            feet = parseInt(
                parts[0],
                10
            );

            inches = parseInt(
                parts[1],
                10
            ) || 0;

        }

        else {

            feet = parseInt(
                value,
                10
            );

        }


        if (Number.isNaN(feet)) {
            return null;
        }


        return {
            feet,
            inches
        };

    }


    function getBasePriceOption() {

        const length = getBoardLength();

        if (!length) return null;


        const totalInches =
            (length.feet * 12) +
            length.inches;


        /*
         * ARakawa Price Categories
         *
         * Short Boards
         * Up to 6'5"
         *
         * Step Ups
         * 6'6" - 7'1"
         * 7'2" - 7'10"
         * 8'0" - 9'0"
         * 9'1" - 9'6"
         */


        if (totalInches <= 77) {

            return "SHORT BOARDS";

        }


        if (totalInches <= 85) {

            return "STEP UPS 6.6 - 7.1";

        }


        if (totalInches <= 94) {

            return "STEP UPS 7.2 - 7.10";

        }


        if (totalInches <= 108) {

            return "STEP UPS 8.0 - 9.0";

        }


        if (totalInches <= 114) {

            return "STEP UPS 9.1 - 9.6";

        }


        return null;

    }


    function updateBasePrice() {

        const value = getBasePriceOption();

        if (!value) return;


        const option = document.querySelector(
            `input[name="cara-baseprice"][value="${value}"]`
        );


        if (!option) {

            console.warn(
                "Arakawa Base Price not found:",
                value
            );

            return;

        }


        if (option.checked) return;


        option.click();

    }


    /*
     * Recommended Size
     */

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

                setTimeout(() => {
                    updateBasePrice();
                }, 100);

                return;

            }

        }
    );


    /*
     * Manual Length
     */

    const lengthInput = document.querySelector(
        selectors.length
    );


    if (lengthInput) {

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


});