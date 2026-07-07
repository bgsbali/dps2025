document.addEventListener("DOMContentLoaded", () => {

    console.log("BGS DHD Custom Board Loaded");

    const selectors = {
        model: 'input[name="dhd-model"]',
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

        // Contoh:
        // 5.10 × 20 × 2 9/16 – 32L

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

    document.addEventListener("change", (e) => {

        if (e.target.name === "dhd-model") {

            // beri waktu Globo menampilkan Recommended Size default
            setTimeout(populateBoardDimensions, 100);

        }

        const model = getSelectedModel();

        if (!model) return;

        const sizeField = sizeFieldMap[model];

        if (e.target.name === sizeField) {

            populateBoardDimensions();

        }

    });

});