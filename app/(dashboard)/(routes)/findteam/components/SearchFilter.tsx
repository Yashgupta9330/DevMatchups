"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export function SearchFilter() {
    const placeholders = [
        "Backend Developer/Devops Engineer...",
        "Django, Backend Dev - Delhi...",
        "Online/Offline...",
        "Malviya Nagar, Jaipur...",
        "React Native - Pune...",
        "Next JS - Frontend...",
        "Saki Vihar Road, Mumbai...",
        "Unstop/Devfolio...",
        "Online - Web 3...",
        "Rust, Python, Open AI, Javascript...",
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    };
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submitted");
    };
    return (<div className="w-full mx-auto">
        <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
        />
    </div>
    );
}
