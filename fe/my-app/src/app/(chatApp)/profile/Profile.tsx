"use client";

import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { UserUpdateSchemaType } from "@/validations/user";
import { apiPrivate } from "@/lib/api";
import { toast } from "sonner";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  console.log(user);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        imageUrl: user.imageUrl || "/images/default-avatar.png",
      });
    }
  }, [user]);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    imageUrl: user?.imageUrl || "/images/default-avatar.png",
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // reacrt query
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UserUpdateSchemaType) => {
      const res = await apiPrivate.patch(`/user/${user?.id}`, data);
      return res.data;
    },
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data);
      setUser(data);
      toast.success("Cập nhật thành công");
    },
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500">Chưa có thông tin người dùng</p>
      </div>
    );
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    const imagePreview = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, imageUrl: imagePreview }));
    setFile(file);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Upload ảnh thất bại");
    const data = await res.json();
    return data.secure_url as string;
  };

  const handleSave = async () => {
    console.log("Dữ liệu cập nhật gửi API: ", formData);
    let imageUrl = formData.imageUrl;
    if (file) {
      toast.info("Đang upload ảnh...");
      imageUrl = await uploadToCloudinary(file);
    }

    const { name } = formData;
    console.log(formData);

    mutate({ name, imageUrl });
    setEditingField(null);
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border shadow">
              <Image
                src={formData.imageUrl}
                alt={formData.name || "User avatar"}
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100">
              <Pencil className="w-4 h-4 text-gray-600" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleImageChange(e.target.files ? e.target.files[0] : null)
                }
              />
            </label>
          </div>

          {/* Name */}
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            {editingField === "name" ? (
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            ) : (
              <>
                {formData.name}
                <Pencil
                  className="w-4 h-4 cursor-pointer text-gray-500"
                  onClick={() => setEditingField("name")}
                />
              </>
            )}
          </CardTitle>

          {/* Email */}
          <div className="flex items-center gap-2">
            {editingField === "email" ? (
              <Input
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            ) : (
              <>
                {formData.email}
                {/* <Pencil
                  className="w-4 h-4 cursor-pointer text-gray-500"
                  onClick={() => setEditingField("email")}
                /> */}
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="text-center mt-4">
          <p className="text-gray-600 mb-4">
            Đây là thông tin tài khoản của bạn.
          </p>
          <div className="flex justify-center">
            <Button onClick={handleSave} disabled={isPending}>
              Cập nhật
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
