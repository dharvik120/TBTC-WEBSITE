import React from "react";
import prisma from "@/lib/prisma";
import FormBuilderClient from "@/components/admin/FormBuilderClient";

export default async function AdminFormBuilderPage() {
  const fields = await prisma.formField.findMany({
    orderBy: { displayOrder: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Dynamic Form Builder CMS
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Build custom fields elements, mark fields mandatory, construct select dropdown menus, and customize placeholders for general, contact and products quote inquiries.
          </p>
        </div>
      </div>

      <FormBuilderClient initialFields={fields} />
    </div>
  );
}
