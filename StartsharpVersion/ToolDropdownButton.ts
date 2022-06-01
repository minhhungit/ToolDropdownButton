//===================================================
//  Copyright @ 2022
//  Author : Hung Vo (it.minhhung@gmail.com)
//  Time : 2022, June 01
//  Description : ToolDropdownButton
//===================================================
namespace J {
    export interface ToolDropdownButtonOptions {
        title?: string;
        cssClass?: string;
        icon?: string;
        disabled?: boolean;
        menuAlignment ?: "right";
        directions?: "dropup" | "dropend" | "dropstart";
        autoCloseBehavior?: "true" | "inside" | "outside" | "false";
        dataBsOffset?: string;
    }

    export interface ToolDropdownButtonItem {
        key: string;
        title?: string;
        hint?: string;
        cssClass?: string;
        icon?: string;
        onClick?: any;
        isSeparator?: boolean;
        disabled?: boolean;
        isHeader?: boolean;
    }

    export interface ToolDropdownSideButtonItem {
        key: string;
        title?: string;
        hint?: string;
        cssClass?: string;
        icon?: string;
        onClick?: any;
        disabled?: boolean;
    }

    export class ToolDropdownButton {

        public element: JQuery = null;
        private isDisabled: boolean = false;
        private itemDisablingState: { key: string, disabled: boolean }[] = [];

        private options: ToolDropdownButtonOptions;

        public constructor(container: JQuery, buttons: ToolDropdownButtonItem[], opt?: ToolDropdownButtonOptions) {
            this.options = opt || {};
            this.isDisabled = this.options.disabled || false;

            this.element = this.buildBaseDropdown();
            this.addDropdownItems(buttons);

            container.append(this.element);
        }

        private getDisablingStateItem(key: string): boolean {
            if (Q.tryFirst(this.itemDisablingState, x => x.key == key) != null) {
                return Q.first(this.itemDisablingState, x => x.key == key).disabled || false;
            }

            return false;
        }

        private setDisablingStateItem(key: string, value: boolean) {

            if (Q.tryFirst(this.itemDisablingState, x => x.key == key) != null) {
                Q.first(this.itemDisablingState, x => x.key == key).disabled = (value || false);
                return;
            }

            this.itemDisablingState.push({ key: key, disabled: (value || false) });
        }

        private removeDisablingStateItem(key: string) {
            this.itemDisablingState.some((item, idx) => {
                if (item.key == key) {
                    this.itemDisablingState.splice(idx, 1);

                    return true;
                }
            });
        }

        private buildBaseDropdown(): JQuery {
            // https://getbootstrap.com/docs/5.0/components/dropdowns/

            let hasIcon = Q.trimToNull(this.options.icon) != null;

            let dropdownTemplate =
                `<div class="buttons-inner">
                    <div class="j-tool-dropdown-button dropdown tool-button ${hasIcon ? "icon-tool-button" : ""} ${this.isDisabled ? "disabled" : ""}">
                        <div class='button-outer'>
                            <span class="button-inner ${Q.coalesce(this.options.directions, "")}">`; 
             
            if (hasIcon) {
                dropdownTemplate += `<i class='${Q.coalesce(this.options.icon, "")}'"></i>`;
            }

            dropdownTemplate += `<a href="#" class="dropdown-toggle ${Q.coalesce(this.options.cssClass, "")} ${this.isDisabled ? "disabled" : ""}" style="text-decoration: none" data-bs-toggle="dropdown" data-bs-auto-close="${Q.coalesce(this.options.autoCloseBehavior, "true")}" aria-expanded="false" data-bs-offset="${Q.trimToNull(this.options.dataBsOffset) == null ? "0,0": this.options.dataBsOffset}">${Q.coalesce(this.options.title, "")}</a>
                                <ul class="dropdown-menu ${this.options.menuAlignment == "right" ? "dropdown-menu-end" : ""}"></ul>
                            </span>
                        </div>
                    </div>
                </div>`;
                
            return $(dropdownTemplate);
        }

        public addDropdownItems(buttons: ToolDropdownButtonItem[]) {
            if (buttons && buttons.length > 0) {
                buttons.forEach((button, idx) => {
                    this.addDropdownItem(button);
                });
            }
        }

        public addDropdownItem(button: ToolDropdownButtonItem, idx?: number) {

            if (!Q.isEmptyOrNull(button.key)) {
                if (this.itemDisablingState.map(x => x.key).indexOf(button.key) > -1) {
                    Q.alert(`Dropdown has existed key: ${button.key}`);
                    return;
                }

                this.setDisablingStateItem(button.key, (button.disabled || false));
            }

            let dropdownItemElement: JQuery;

            if (button.isHeader && !Q.isEmptyOrNull(button.title)) {
                dropdownItemElement = $(`<li><h6 class="dropdown-header ${Q.coalesce(button.cssClass, "")}">${button.title}</h6></li>`);
            }
            else {
                if (button.isSeparator) {
                    dropdownItemElement = $(`<li><hr class="divider"></li>`);
                }
                else {
                    dropdownItemElement = $(`<li j-key="${Q.coalesce(button.key, "")}"                                                 
                                                title="${Q.coalesce(button.hint, "")}">
                                                <a class="dropdown-item ${button.disabled ? "disabled" : ""}" href="#" class="${Q.coalesce(button.cssClass, "")}">
                                                    <i class="${Q.coalesce(button.icon, "")}"></i>
                                                    ${button.title}
                                                </a>
                                            </li>`);

                    dropdownItemElement.click((e) => {
                        e.preventDefault();

                        if (this.isDisabled) {
                            return;
                        }

                        let buttonIsDisabled = button.disabled;

                        if (!Q.isEmptyOrNull(button.key)) {
                            buttonIsDisabled = this.getDisablingStateItem(button.key);
                        }
                        if (buttonIsDisabled) {
                            return;
                        }

                        button.onClick && button.onClick(e);
                    });
                }
            }

            if (idx === null || typeof idx === 'undefined') {
                this.element.find(".dropdown-menu").append(dropdownItemElement);
                return;
            }

            if (idx <= 0) {
                this.element.find(".dropdown-menu").prepend(dropdownItemElement);
                return;
            }

            let nbrOfButtons = this.element.find(`.dropdown-menu > li`).length;

            if (idx > nbrOfButtons) {
                idx = nbrOfButtons;
            }

            this.element.find(`.dropdown-menu > li:nth-child(${idx})`).after(dropdownItemElement);
        }

        public replaceDropdownItems(buttons: ToolDropdownButtonItem[]) {
            this.element.find(".dropdown-menu").empty();

            this.addDropdownItems(buttons);
        }

        public enableDropdown(enable: boolean) {
            let drd = this.element.find(".dropdown").first();
            if (drd) {
                if (enable) {
                    if (drd.hasClass("disabled")) {
                        drd.removeClass("disabled");
                    }
                }
                else {
                    if (!drd.hasClass("disabled")) {
                        drd.addClass("disabled");
                    }
                }
            }

            let drdToggle = this.element.find(".dropdown-toggle").first();
            if (drdToggle) {
                if (enable) {
                    if (drdToggle.hasClass("disabled")) {
                        drdToggle.removeClass("disabled");
                    }
                }
                else {
                    if (!drdToggle.hasClass("disabled")) {
                        drdToggle.addClass("disabled");
                    }
                }
            }

            this.isDisabled = !enable;
        }

        public enableDropdownItemByKey(key: string, enable: boolean) {
            let drdItem = this.element.find(`.dropdown-menu li[j-key="${key}"]`).first();
            if (drdItem) {
                if (enable) {
                    if (drdItem.find("a:first").hasClass("disabled")) {
                        drdItem.find("a:first").removeClass("disabled");
                    }
                }
                else {
                    if (!drdItem.find("a:first").hasClass("disabled")) {
                        drdItem.find("a:first").addClass("disabled");
                    }
                }
            }
            this.setDisablingStateItem(key, !enable);
        }

        public enableSideButtonByKey(key: string, enable: boolean) {

            let tButton = this.element.find(`.tool-button[j-key="${key}"]`).first();
            if (tButton) {
                if (enable) {
                    if (tButton.hasClass("disabled")) {
                        tButton.removeClass("disabled");
                    }
                }
                else {
                    if (!tButton.hasClass("disabled")) {
                        tButton.addClass("disabled");
                    }
                }
            }

            this.setDisablingStateItem(key, !enable);
        }

        public removeDropdownItem(key: string) {
            this.element.find(`.dropdown-menu li[j-key="${key}"]`).remove();
            this.removeDisablingStateItem(key);
        }

        public removeSideButtonItem(key: string) {
            this.element.find(`.tool-button[j-key="${key}"]`).remove();
            this.removeDisablingStateItem(key);
        }

        public addSideButtonItem(button: ToolDropdownSideButtonItem, idx?: number) {

            if (!Q.isEmptyOrNull(button.key)) {

                if (this.itemDisablingState.map(x => x.key).indexOf(button.key) > -1) {
                    Q.alert(`Dropdown has existed key: ${button.key}`);
                    return;
                }

                this.setDisablingStateItem(button.key, (button.disabled || false));
            }

            let sideButtonTemplate = `<div class="tool-button add-button icon-tool-button ${Q.coalesce(button.cssClass, "")} ${button.disabled ? "disabled" : ""}" j-key="${Q.coalesce(button.key, "")}" title="${Q.coalesce(button.key, "")}">
                                        <div class="button-outer">
                                            <span class="button-inner">
                                                <i class="${Q.coalesce(button.icon, "")}"></i> ${Q.coalesce(button.title, "")}
                                            </span>
                                        </div>
                                    </div>`;

            let sideButton = $(sideButtonTemplate);

            sideButton.click(e => {
                e.preventDefault();

                let buttonIsDisabled = button.disabled;

                if (!Q.isEmptyOrNull(button.key)) {
                    buttonIsDisabled = this.getDisablingStateItem(button.key);
                }

                if (buttonIsDisabled) {
                    return;
                }

                button.onClick && button.onClick(e);
            });

            if (idx === null || typeof idx === 'undefined') {
                this.element.append(sideButton);
                return;
            }

            if (idx <= 0) {
                this.element.prepend(sideButton);
                return;
            }

            let nbrOfButtons = this.element.find(`div.tool-button`).length;

            if (idx > nbrOfButtons) {
                idx = nbrOfButtons;
            }

            this.element.find(`div.tool-button:nth-child(${idx})`).after(sideButton);
        }
    }
}