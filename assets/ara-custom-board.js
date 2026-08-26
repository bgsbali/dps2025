document.addEventListener("DOMContentLoaded", () => {

    console.log("BGS Arakawa Custom Board Loaded");

    const selectors = {
        model: 'input[name="cara-model"]',
        construction: 'input[name="cara-construction"]',
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


    function getSelectedConstruction() {

        return document.querySelector(
            `${selectors.construction}:checked`
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


    function getBasePriceCategory() {

        const length = getBoardLength();

        if (!length) return null;


        const totalInches =
            (length.feet * 12) +
            length.inches;


        /*
         * Arakawa Price Categories
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


    function getBasePriceOption() {

        const category = getBasePriceCategory();
        const construction = getSelectedConstruction();

        if (!category || !construction) {

            return null;

        }


        return `${category} - ${construction}`;

    }


    function updateBasePrice() {

        console.log("=== ARAKAWA UPDATE BASE PRICE ===");


        const length = getBoardLength();
        const construction = getSelectedConstruction();
        const category = getBasePriceCategory();
        const value = getBasePriceOption();


        console.log(
            "ARAKAWA LENGTH:",
            length
        );

        console.log(
            "ARAKAWA CONSTRUCTION:",
            construction
        );

        console.log(
            "ARAKAWA CATEGORY:",
            category
        );

        console.log(
            "ARAKAWA BASE PRICE VALUE:",
            value
        );


        if (!value) return;


        const option = document.querySelector(
            `input[name="cara-baseprice"][value="${value}"]`
        );


        console.log(
            "ARAKAWA BASE PRICE ELEMENT:",
            option
        );


        if (!option) {

            console.warn(
                "Arakawa Base Price not found:",
                value
            );

            return;

        }


        console.log(
            "ARAKAWA CURRENT CHECKED:",
            option.checked
        );


        if (option.checked) return;


        option.click();


        console.log(
            "ARAKAWA BASE PRICE CLICKED:",
            value
        );

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

                console.log(
                    "ARAKAWA SIZE SELECTED:",
                    e.target.value
                );


                populateBoardDimensions(
                    e.target.value
                );


                setTimeout(() => {

                    updateBasePrice();

                }, 100);


                return;

            }


            /*
             * Construction
             */

            if (
                e.target.matches(
                    'input[name="cara-construction"]'
                )
            ) {

                console.log(
                    "ARAKAWA CONSTRUCTION SELECTED:",
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
     *
     * Delegated event supaya tetap bekerja
     * walaupun field dibuat/diperbarui oleh
     * option app.
     */


    document.addEventListener(
        "input",
        (e) => {

            if (
                e.target.matches(
                    selectors.length
                )
            ) {

                console.log(
                    "ARAKAWA MANUAL LENGTH INPUT:",
                    e.target.value
                );


                updateBasePrice();

            }

        }
    );


    document.addEventListener(
        "change",
        (e) => {

            if (
                e.target.matches(
                    selectors.length
                )
            ) {

                console.log(
                    "ARAKAWA MANUAL LENGTH CHANGE:",
                    e.target.value
                );


                updateBasePrice();

            }

        }
    );


    document.addEventListener(
        "blur",
        (e) => {

            if (
                e.target.matches(
                    selectors.length
                )
            ) {

                console.log(
                    "ARAKAWA MANUAL LENGTH BLUR:",
                    e.target.value
                );


                updateBasePrice();

            }

        },
        true
    );


});