import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Heart, PartyPopper, Image as ImageIcon, Trash2, Plus } from "lucide-react";

export interface Service {
    id: string;
    title: string;
    price: string;
    features: string[];
    icon_name: string;
}

interface ServiceEditDialogProps {
    service: Service | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (service: Partial<Service>) => Promise<void>;
}

const icons = [
    { name: "Heart", icon: Heart },
    { name: "Camera", icon: Camera },
    { name: "PartyPopper", icon: PartyPopper },
    { name: "ImageIcon", icon: ImageIcon },
];

export default function ServiceEditDialog({
                                             service,
                                             open,
                                             onOpenChange,
                                             onSave,
                                         }: ServiceEditDialogProps) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [iconName, setIconName] = useState("Camera");
    const [features, setFeatures] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (service) {
            setTitle(service.title);
            setPrice(service.price);
            setIconName(service.icon_name);
            setFeatures(service.features || []);
        } else {
            setTitle("");
            setPrice("");
            setIconName("Camera");
            setFeatures([]);
        }
    }, [service, open]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({
                title,
                price,
                icon_name: iconName,
                features,
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const addFeature = () => {
        if (newFeature.trim()) {
            setFeatures([...features, newFeature.trim()]);
            setNewFeature("");
        }
    };

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{service ? "Edit Service" : "Add New Service"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Service Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Weddings"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="price">Price Label</Label>
                        <Input
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g. From $3,500"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Icon</Label>
                        <div className="flex gap-4">
                            {icons.map((item) => (
                                <button
                                    key={item.name}
                                    type="button"
                                    onClick={() => setIconName(item.name)}
                                    className={`p-3 border rounded-md transition-colors ${
                                        iconName === item.name
                                            ? "border-foreground bg-secondary"
                                            : "border-border hover:bg-secondary/50"
                                    }`}
                                >
                                    <item.icon className="w-6 h-6" strokeWidth={1.5} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Features</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                placeholder="Add a feature..."
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                            />
                            <Button type="button" size="icon" onClick={addFeature}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="mt-2 space-y-2 max-h-[150px] overflow-y-auto pr-2">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 bg-secondary/30 p-2 rounded-md group">
                                    <span className="flex-1 text-sm">{feature}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeFeature(index)}
                                    >
                                        <Trash2 className="h-3 w-3 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
