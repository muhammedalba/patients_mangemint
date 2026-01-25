import InputError from '@/components/input-error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FileText, Image as ImageIcon, Paperclip, X } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';

interface FilesTabProps {
    data: {
        images: (File | string)[];
        attachments: (File | string)[];
    };
    setData: <K extends keyof FilesTabProps['data']>(
        key: K,
        value: FilesTabProps['data'][K],
    ) => void;
    existingImages: (string | File)[];
    existingAttachments: (string | File)[];
    onDeleteImage: (image: string | File) => void;
    onDeleteAttachment: (attachment: string | File) => void;
    imagesErrors: string[];
    attachmentsErrors: string[];
    isEdit?: boolean;
}

export function FilesTab({
    data,
    setData,
    existingImages,
    existingAttachments,
    onDeleteImage,
    onDeleteAttachment,
    imagesErrors,
    attachmentsErrors,
    isEdit = false,
}: FilesTabProps) {
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle>المرفقات والوسائط</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Images */}
                <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        صور الأشعة والحالة
                    </Label>
                    {imagesErrors.map((err, i) => (
                        <InputError message={err} key={i} className="mt-1" />
                    ))}
                    <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition-colors hover:bg-slate-100">
                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            id="image-upload"
                            onChange={(e) =>
                                setData(
                                    'images',
                                    Array.from(e.target.files || []),
                                )
                            }
                        />

                        <Label
                            htmlFor="image-upload"
                            className="block cursor-pointer"
                        >
                            <div className="flex flex-col items-center gap-2 text-slate-500">
                                <div className="rounded-full bg-white p-2 shadow-sm">
                                    <ImageIcon className="h-6 w-6 text-teal-600" />
                                </div>
                                <span className="text-sm">
                                    اضغط لرفع صور (JPG, PNG)
                                </span>
                            </div>
                        </Label>
                    </div>

                    {/* Existing Images Gallery */}
                    {(existingImages.length > 0 || data.images.length > 0) && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {existingImages.map((img, i) => (
                                <div
                                    key={i}
                                    className="group relative aspect-square overflow-hidden rounded-lg bg-black/5"
                                >
                                    <a
                                        href={`/storage/${img}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block h-full w-full cursor-zoom-in"
                                    >
                                        <img
                                            alt="Medical Attachment"
                                            src={`/storage/${img}`}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </a>
                                    {isEdit ? (
                                        <ConfirmDialog
                                            title="تأكيد الحذف"
                                            description="هل أنت متأكد من حذف هذه الصورة نهائياً؟"
                                            onConfirm={() => onDeleteImage(img)}
                                        >
                                            <button
                                                title="Delete Image"
                                                type="button"
                                                className="absolute top-2 right-2 z-10 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </ConfirmDialog>
                                    ) : (
                                        <button
                                            title="Delete Image"
                                            type="button"
                                            onClick={() => onDeleteImage(img)}
                                            className="absolute top-2 right-2 z-10 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* New Images Previews */}
                            {data.images.filter(f => f instanceof File).map((file, i) => (
                                <div
                                    key={`new-${i}`}
                                    className="group relative aspect-square overflow-hidden rounded-lg bg-black/5"
                                >
                                    <img
                                        alt="New Upload"
                                        src={URL.createObjectURL(file)}
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        title="Remove Image"
                                        type="button"
                                        onClick={() => {
                                            const newImages = [...data.images];
                                            const indexInOriginal = data.images.indexOf(file);
                                            newImages.splice(indexInOriginal, 1);
                                            setData('images', newImages);
                                        }}
                                        className="absolute top-2 right-2 rounded-full bg-slate-800/50 p-1.5 text-white hover:bg-red-500"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Separator />

                {/* Attachments */}
                <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        مستندات أخرى
                    </Label>
                    <Input
                        type="file"
                        multiple
                        onChange={(e) =>
                            setData(
                                'attachments',
                                Array.from(e.target.files || []),
                            )
                        }
                        className="w-full"
                    />
                    {attachmentsErrors.map((err, i) => (
                        <InputError message={err} key={i} className="mt-1" />
                    ))}

                    {existingAttachments.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {existingAttachments.map((file, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <FileText className="h-4 w-4 text-slate-400" />
                                        <a
                                            href={`/storage/${file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="max-w-50 truncate text-blue-600 hover:underline"
                                        >
                                            {typeof file === 'string' ? file.split('/').pop() : file?.name}
                                        </a>
                                    </div>
                                    {isEdit ? (
                                        <ConfirmDialog
                                            title="تأكيد الحذف"
                                            description="هل أنت متأكد من حذف هذا الملف نهائياً؟"
                                            onConfirm={() => onDeleteAttachment(file)}
                                        >
                                            <button
                                                type="button"
                                                title="Delete Attachment"
                                                className="rounded p-1 text-red-500 hover:bg-red-50"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </ConfirmDialog>
                                    ) : (
                                        <button
                                            type="button"
                                            title="Delete Attachment"
                                            onClick={() => onDeleteAttachment(file)}
                                            className="rounded p-1 text-red-500 hover:bg-red-50"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* New Attachments */}
                            {data.attachments.filter(f => f instanceof File).map((file, i) => (
                                <div
                                    key={`new-att-${i}`}
                                    className="flex items-center justify-between rounded-md border border-teal-50 bg-teal-50/30 px-3 py-2 text-sm"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <Paperclip className="h-4 w-4 text-teal-500" />
                                        <span className="max-w-50 truncate text-slate-700">
                                            {file.name}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        title="Remove Attachment"
                                        onClick={() => {
                                            const newAtts = [...data.attachments];
                                            const indexInOriginal = data.attachments.indexOf(file);
                                            newAtts.splice(indexInOriginal, 1);
                                            setData('attachments', newAtts);
                                        }}
                                        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
