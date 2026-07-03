document.addEventListener("DOMContentLoaded", () => {

    function convertLength(length) {

        length = length.trim();

        const parts = length.split(".");

        if (parts.length === 2) {
            return `${parts[0]}'${parts[1]}"`;
        }

        return length;
    }

    function fillMeasurement(value) {

        if (!value) return;

        const parts = value.split(/\s*x\s*/i);

        if (parts.length < 4) return;

        const length = convertLength(parts[0]);
        const width = parts[1].trim();
        const thickness = parts[2].trim();
        const volume = parts[3].trim();

        document.querySelector("#text-1").value = length;
        document.querySelector("#text-2").value = width;
        document.querySelector("#text-3").value = thickness;
        document.querySelector("#text-4").value = volume;

        ["#text-1","#text-2","#text-3","#text-4"].forEach(selector => {
            document.querySelector(selector)
                .dispatchEvent(new Event("input",{bubbles:true}));
        });

    }

    document.addEventListener("change", function(e){

        if(e.target.matches("input[data-field-name$='-size']")){

            fillMeasurement(e.target.value);

        }

    });

});