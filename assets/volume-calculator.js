document.addEventListener("DOMContentLoaded", () => {

    const calculators = document.querySelectorAll(".bgs-volume-calculator");

    if (!calculators.length) return;

    calculators.forEach((calculator) => {

        const weightSlider = calculator.querySelector(".weight");
        const weightValue = calculator.querySelector("#weightValue");
        const skill = calculator.querySelector("#skill");
        const calculateBtn = calculator.querySelector("#calculateVolume");

        const resultBox = calculator.querySelector("#volumeResult");
        const volumeLitres = calculator.querySelector("#volumeLitres");
        const volumeMin = calculator.querySelector("#volumeMin");
        const volumeMax = calculator.querySelector("#volumeMax");
        const placeholder = calculator.querySelector("#volumePlaceholder");
        const shopBtn = calculator.querySelector("#shopBoardsBtn");

        if (!weightSlider || !calculateBtn) return;

        weightSlider.addEventListener("input", () => {
            weightValue.textContent = weightSlider.value;
        });

        calculateBtn.addEventListener("click", () => {

            const weight = parseFloat(weightSlider.value);
            const multiplier = parseFloat(skill.value);

            const volume = weight * multiplier;
            const minVolume = volume * 0.95;
            const maxVolume = volume * 1.05;

            volumeLitres.textContent = volume.toFixed(1);
            volumeMin.textContent = minVolume.toFixed(1);
            volumeMax.textContent = maxVolume.toFixed(1);

            placeholder.style.display = "none";

            shopBtn.classList.remove("disabled");

            const volumeFilter = Math.floor(volume);

            shopBtn.textContent = `Shop ${volumeFilter}L Surfboards`;

            const baseUrl =
                shopBtn.getAttribute("href") ||
                "/collections/surfboards";

            shopBtn.href =
                baseUrl +
                "?filter.p.m.custom.available_volumes=" +
                volumeFilter;

            resultBox.classList.remove("animate");

            void resultBox.offsetWidth;

            resultBox.classList.add("animate");

        });

    });

});