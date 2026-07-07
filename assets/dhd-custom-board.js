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

    document.addEventListener("change", (e) => {

        // Ketika model berubah
        if (e.target.name === "dhd-model") {
            console.log("Model:", getSelectedModel());
            console.log("Recommended Size:", getSelectedRecommendedSize());
        }

        // Ketika Recommended Size berubah
        const model = getSelectedModel();

        if (!model) return;

        const sizeField = sizeFieldMap[model];

        if (e.target.name === sizeField) {
            console.log("Recommended Size:", getSelectedRecommendedSize());
        }

    });

});