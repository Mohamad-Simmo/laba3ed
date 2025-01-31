import db from "@/lib/db";
import React from "react";
import { GoArrowLeft, GoLocation } from "react-icons/go";
import RequestCardTime from "@/components/request-card-time";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HiPhone } from "react-icons/hi";
import ReportButton from "@/components/report-button";
import DeleteRequest from "@/components/request-delete";
import RequestCard from "@/components/request-card";
import { getTranslations } from "next-intl/server";

export default async function Page({
  params,
}: {
  params: { requestId: number };
}) {
  const need = await db.need.findUniqueOrThrow({
    where: {
      id: Number(params.requestId),
    },
  });
  const t = await getTranslations("singleRequestPage");

  if (!need) {
    return <div>not found</div>;
  }

  const similarNeeds = await db.need.findMany({
    where: {
      category: need.category,
      id: { not: need.id },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  return (
    <>
      <div className="p-4 border shadow rounded-lg">
        <div className="flex gap-4">
          <Link href="/">
            <Button variant={"outline"} size={"icon"} className="rounded-full">
              <GoArrowLeft className="size-5" />
            </Button>
          </Link>

          <div className="space-y-3 flex-1">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">{need.category}</h1>
              <RequestCardTime createdAt={need.createdAt} />
            </div>
            <p className="leading-7 whitespace-pre-wrap">{need.description}</p>
            <p className="">
              <HiPhone className="inline-block mr-1" />
              {need.contact}
            </p>
            <p className="flex items-center mb-2">
              <GoLocation className="inline-block mr-1" />
              {need.area}
            </p>
            <div className="flex justify-end gap-3">
              <ReportButton requestId={Number(params.requestId)} />
              <DeleteRequest requestId={Number(params.requestId)} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg mb-3 font-medium">{t("similarRequests")}</h2>

        {similarNeeds.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {similarNeeds.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
