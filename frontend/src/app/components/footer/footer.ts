import { Component } from "@angular/core";
import {
    LucideCopyright,
    LucideDynamicIcon,
    LucideExternalLink,
    LucideMailOpen,
    LucidePhone,
} from "@lucide/angular";

@Component({
  selector: "app-footer",
  imports: [LucideDynamicIcon],
  templateUrl: "./footer.html",
  styles: ``,
})
export class Footer {
  readonly LucideCopyright = LucideCopyright;
  readonly LucideExternalLink = LucideExternalLink;
  readonly LucidePhone = LucidePhone;
  readonly LucideMailOpen = LucideMailOpen;

  readonly currentYear = new Date().getFullYear();
}
