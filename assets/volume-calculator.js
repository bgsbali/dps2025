document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".bgs-volume-calculator").forEach((calculator) => {

        const weightSlider = calculator.querySelector(".bgs-weight");
        const weightValue = calculator.querySelector(".bgs-weight-value");
        const skill = calculator.querySelector(".bgs-skill");
        const calculateBtn = calculator.querySelector(".bgs-calculate");

        const resultBox = calculator.querySelector(".bgs-result");
        const volumeLitres = calculator.querySelector(".bgs-volume-litres");
        const volumeMin = calculator.querySelector(".bgs-volume-min");
        const volumeMax = calculator.querySelector(".bgs-volume-max");
        const placeholder = calculator.querySelector(".bgs-placeholder");
        const shopBtn = calculator.querySelector(".bgs-shop-btn");

        if (!weightSlider) return;

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

            const filter = Math.floor(volume);

            shopBtn.textContent = `Shop ${filter}L Surfboards`;

            shopBtn.href =
                `/collections/surfboards?filter.p.m.custom.available_volumes=${filter}`;

        });

    });

});