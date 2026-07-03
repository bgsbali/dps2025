document.addEventListener("DOMContentLoaded", () => {

    console.log("BGS Custom Board Loaded");

    const selectors = {
        length: "#text-1",
        width: "#text-2",
        thickness: "#text-3",
        volume: "#text-4"
    };

    let isUpdating = false;

    function convertLength(length) {

        length = length.trim();

        if (length.includes("'")) return length;

        const parts = length.split(".");

        if (parts.length === 2) {
            return `${parts[0]}'${parts[1]}"`;
        }

        return length;

    }

    function normalizeVolume() {

        const volumeInput = document.querySelector(selectors.volume);

        if (!volumeInput) return;

        let value = volumeInput.value.trim();

        // Hapus semua huruf L
        value = value.replace(/l/gi, "").trim();

        // Kalau kosong, biarkan kosong
        if (value === "") {
            volumeInput.value = "";
            return;
        }

        // Tambahkan satu L di belakang
        volumeInput.value = value + "L";

    }

    function updateInput(selector, value) {

        const input = document.querySelector(selector);

        if (!input) return;

        // Khusus Volume, pastikan selalu berakhiran L
        if (selector === selectors.volume) {
            value = value.replace(/l/gi, "").trim() + "L";
        }

        if (input.value === value) return;

        input.value = value;

        input.dispatchEvent(new Event("input", {
            bubbles: true
        }));

        input.dispatchEvent(new Event("change", {
            bubbles: true
        }));

    }

    function parseMeasurement(measurement) {

        if (isUpdating) return;

        isUpdating = true;

        try {

            const parts = measurement
                .split(/\s*x\s*/i)
                .map(p => p.trim());

            if (parts.length !== 4) return;

            updateInput(
                selectors.length,
                convertLength(parts[0])
            );

            updateInput(
                selectors.width,
                parts[1]
            );

            updateInput(
                selectors.thickness,
                parts[2]
            );

            updateInput(
                selectors.volume,
                parts[3]
            );

            console.log("Auto Filled:", measurement);

        } finally {

            isUpdating = false;

        }

    }

    // Autofill saat Recommended Size berubah
    document.addEventListener("change", function (e) {

        if (e.target.matches('input[data-field-name$="-size"]')) {

            console.log("Recommended:", e.target.value);

            parseMeasurement(e.target.value);

            return;
        }

        // Kalau user mengubah Volume secara manual
        if (
            e.target.matches(selectors.volume) &&
            !isUpdating
        ) {
            normalizeVolume();
        }

    });

    // Saat user keluar dari field Volume
    const volumeInput = document.querySelector(selectors.volume);

    if (volumeInput) {

        volumeInput.addEventListener("blur", normalizeVolume);

        volumeInput.addEventListener("focus", function () {

            normalizeVolume();

            // Letakkan cursor sebelum huruf L
            const pos = this.value.length - 1;

            this.setSelectionRange(pos, pos);

        });

        // Kalau autofill sudah mengisi value sebelum listener aktif
        normalizeVolume();

    }

});