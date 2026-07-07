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

    const sizeFieldMap = {
        "Black Diamond": "blackdiamond-size",
        "Black Diamond Soft Top": "blackdiamondsofttop-size",
        "EE Juliette": "eejuliette-size",
        "EE Juliette JNR": "eejuliettejnr-size",
        "EE Juliette RT": "eejuliettert-size",
        "EE Juliette RT JNR": "eejuliettertjnr-size",
        "Interceptor": "interceptor-size",
        "MF Bolt": "mfbolt-size",
        "MF DNA": "mfdna-size",
        "MF DNA JNR": "mfdnajnr-size",
        "MF Lightning": "mflightning-size",
        "MF Twin": "mftwin-size",
        "Mini Twin": "minitwin-size",
        "Mini Twin II": "minitwinii-size",
        "Nexus": "nexus-size",
        "Phoenix": "phoenix-size",
        "Phoenix Swallow Tail": "phoenixswallowtail-size",
        "Phoenix Flight": "phoenixflight-size",
        "Sandman": "sandman-size",
        "SG No.8": "sgno8-size",
        "Sweet Spot 4.0": "sweetspot40-size",
        "The Twin": "thetwin-size",
        "Utopia": "utopia-size"
    };

    function getSelectedModel() {
        return document.querySelector(`${selectors.model}:checked`)?.value ?? null;
    }

    function getSelectedConstruction() {
        return document.querySelector(`${selectors.construction}:checked`)?.value ?? null;
    }

    function getSelectedRecommendedSize() {

        const model = getSelectedModel();

        if (!model) return null;

        const fieldName = sizeFieldMap[model];

        if (!fieldName) return null;

        return document.querySelector(
            `input[name="${fieldName}"]:checked`
        )?.value ?? null;
    }

    function updateInput(selector, value) {

        const input = document.querySelector(selector);

        if (!input) return;

        input.value = value;

        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
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

    function populateBoardDimensions() {

        const size = getSelectedRecommendedSize();

        if (!size) return;

        const data = parseRecommendedSize(size);

        if (!data) return;

        updateInput(selectors.length, data.length);
        updateInput(selectors.width, data.width);
        updateInput(selectors.thickness, data.thickness);
        updateInput(selectors.volume, data.volume);

        console.log("Board Dimensions", data);
    }

    function getBoardLength() {

        const input = document.querySelector(selectors.length);

        if (!input) return null;

        const value = input.value.trim();

        // Support:
        // 6
        // 6.0
        // 6.6
        // 6.10

        if (!value.includes(".")) {

            return {
                feet: parseInt(value, 10),
                inches: 0,
                isUpTo66() {
                    return this.feet < 6 || (this.feet === 6 && this.inches <= 6);
                }
            };

        }

        const parts = value.split(".");

        return {
            feet: parseInt(parts[0], 10),
            inches: parseInt(parts[1], 10) || 0,
            isUpTo66() {
                return this.feet < 6 || (this.feet === 6 && this.inches <= 6);
            }
        };

    }

    function getBasePriceOption() {

        const model = getSelectedModel();
        const construction = getSelectedConstruction();
        const length = getBoardLength();

        if (!construction || !length) return null;

        // Junior
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

        console.log(getBoardLength());
        console.log(getBasePriceOption());

        const value = getBasePriceOption();

        if (!value) return;

        const option = document.querySelector(
            `input[name="cdhd-baseprice"][value="${value}"]`
        );

        if (!option) {
            console.warn("Base Price not found:", value);
            return;
        }

        if (!option.checked) {
            option.checked = true;
            option.click();
            option.dispatchEvent(new Event("change", { bubbles: true }));
        }

        console.log("Base Price Selected:", value);

    }    

    function refreshPricing() {

        console.log("refreshPricing");

        setTimeout(() => {

            updateBasePrice();

        }, 50);

    }

    const dimensionInputs = [
        selectors.length,
        selectors.width,
        selectors.thickness,
        selectors.volume
    ];

    dimensionInputs.forEach(selector => {

        const input = document.querySelector(selector);

        if (!input) return;

        input.addEventListener("input", refreshPricing);
        input.addEventListener("change", refreshPricing);
        input.addEventListener("blur", refreshPricing);

    });

    

    document.addEventListener("change", (e) => {

        // Model berubah
        if (e.target.name === "dhd-model") {

            setTimeout(() => {

                populateBoardDimensions();
                refreshPricing();

            }, 100);

            return;
        }

        const model = getSelectedModel();

        if (!model) return;

        const sizeField = sizeFieldMap[model];

        // Recommended Size berubah
        if (e.target.name === sizeField) {

            populateBoardDimensions();
            refreshPricing();

            return;
        }

        // Construction berubah
        if (e.target.name === "cdhd-construction") {

            refreshPricing();

        }

    });

});