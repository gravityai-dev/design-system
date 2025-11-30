import React from "react";
import { useGravityClient, renderComponent, filterComponents } from "../GravityTemplate";
import type { KeyServiceProps } from "./types";

/**
 * KeyService Template - Split Layout
 *
 * Left: Non-image components
 * Right: Image components
 */
export default function KeyService(props: KeyServiceProps) {
  const { client } = props;
  const { history } = useGravityClient(client);

  const latest = history.filter((e) => e.type === "assistant_response").pop();
  const components = latest?.components || [];

  return (
    <div className="grid lg:grid-cols-2 h-full">
      {/* LEFT - Content (AIResponse first, then Card, then rest, no images) */}
      <div className="overflow-y-auto bg-white dark:bg-gray-900 px-8 py-6">
        {filterComponents(components, {
          include: ["airesponse", "card", "*"],
          exclude: ["kenburnsimage"],
          order: true,
        }).map((c) => renderComponent(c))}
      </div>

      {/* RIGHT - Images only */}
      <div className="hidden lg:block bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700">
        {filterComponents(components, { include: ["kenburnsimage"] }).map((c) => renderComponent(c))}
      </div>
    </div>
  );
}
