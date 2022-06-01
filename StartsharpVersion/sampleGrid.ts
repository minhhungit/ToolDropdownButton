
namespace your_name_space {

    @Serenity.Decorators.registerClass()
    export class YourGrid extends Serenity.EntityGrid<YourRow, any> {
        // ...
		// ...

        private myToolDropdownButton: J.ToolDropdownButton;

        constructor(container: JQuery) {
            super(container);

            let combineButtons: J.ToolDropdownButtonItem[] = [
                {
                    key: null,
                    isHeader: true,
                    title: "I am a header 🤩",
                    cssClass: "text-purple"
                },
                {
                    key: "demo",
                    title: 'Demoooo',
                    icon: "fa fa-home text-green",
                    cssClass: "text-green",
                    onClick: e => Q.alert("button DEMO is pressed"),
                }, {
                    key: "demo-non-click",
                    title: 'Non click',
                    icon: "fa fa-home text-green",
                    cssClass: "text-green",
                },
                {
                    key: null,
                    isSeparator: true
                },
                {
                    key: null,
                    isHeader: true,
                    title: "Another header.... 😜",
                    cssClass: "text-green"
                },
                {
                    key: "excel-key",
                    title: 'Excel (disabled by configuring)',
                    hint: 'Export to excel',
                    disabled: true,
                    icon: "fa fa-home text-green",
                    onClick: e => Q.alert("button EXCEL is pressed"),
                },
                {
                    key: "word-key",
                    title: 'Item without icon', /*=> & nbsp; Option without icon*/
                    onClick: e => Q.alert("button without icon is pressed"),
                },
                {
                    key: null,
                    isSeparator: true
                },
                {
                    key: null,
                    isHeader: true,
                    title: "3rd header 😜",
                    cssClass: "text-yellow"
                },
                {
                    key: "powerpoint-key",
                    title: 'Powerpoint // and sooooo loooooooooong option (disabled by helper method)',
                    icon: "fa fa-long-arrow-right text-red",
                    cssClass: "text-red",
                    onClick: e => Q.alert("button POWERPOINT is pressed"),
                }
            ];

            this.myToolDropdownButton = new J.ToolDropdownButton(this.toolbar.element.find(".buttons-outer"), combineButtons, {
                title: "Export",
                icon: "fa fa-print text-blue",
                cssClass: "text-red",
            });

            //this.myToolDropdownButton.enableDropdown(false);
            this.myToolDropdownButton.addSideButtonItem({
                key: "side-button-1",
                title: 'Hello',
                icon: "fa fa-long-arrow-right text-red",
                cssClass: "text-red",
                onClick: e => Q.alert("I'm SIDE BUTTON"),
            }, 0);
            

            this.myToolDropdownButton.addDropdownItem({
                key: "addition-key",
                title: 'Hello',
                icon: "fa fa-long-arrow-right text-red",
                cssClass: "text-red",
                onClick: e => Q.alert("I'm new item"),
            });

            this.myToolDropdownButton.enableDropdownItemByKey("addition-key", false);
        }
    }
}