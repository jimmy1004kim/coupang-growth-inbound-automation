import { redirect } from "next/navigation";

import {
  automationTabGroup,
  getDefaultTabHref,
} from "@/config/page-tabs";

export default function AutomationPage() {
  redirect(getDefaultTabHref(automationTabGroup));
}
