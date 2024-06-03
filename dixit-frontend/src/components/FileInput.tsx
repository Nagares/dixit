import { InputProps, useMultiStyleConfig, Input } from "@chakra-ui/react";

type FileInputProps = {
    setImage: Function;
}

export const FileInput = ({ setImage }: FileInputProps) => {
    const styles = useMultiStyleConfig("Button", { variant: "outline" });

    const fileToBase64 = (file: File | Blob): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
            reader.onerror = reject;
        });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            fileToBase64(e.target.files[0]).then((value: string) => setImage(value));
        }
    }

    return (
        <Input
            type="file"
            sx={{
                "::file-selector-button": {
                    border: "none",
                    outline: "none",
                    mr: 2,
                    ...styles,
                },
            }}
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
    );
};