
export class InfoDisplay {
    constructor(contentName) {
        this.activateButton = document.getElementById(contentName + "-button");
        // Initialize menu elements
        const content = document.getElementById(contentName + "-content")

        this.activateButton.addEventListener("click", () => {
            this.showContent(content, contentName)
        });
        this.closeButton = document.getElementById("close-" + contentName + "-btn");


        this.closeWindowListener = () => {
            this.closeWindow(content);
        }
        this.closeButton.addEventListener("click", this.closeWindowListener);

        this.contentName = contentName;

    }

    setLanguage(language) {
        const body = document.getElementById(this.contentName + "-text");
        console.log("Setting language for " + this.contentName);
        body.innerHTML = language[this.contentName + "-text"];
    }


    showContent(content, contentName) {
        console.log("Showing " + contentName);
        content.classList.remove("hidden");
        content.focus()

        // Keyboard listeners
        this.keydownListener = (event) => {
            if (event.key === "Escape") {
                this.closeWindow(content);
            }
        };

        // click ouside of the area listener
        this.closeOnOutsideClickListener = (event) => {
            // Close the about section if the click is outside its content
            if (content && !content.querySelector(".information-container").contains(event.target)) {
                this.closeWindow(content);
            }
        };

        // Add the listeners to close the menu via escape or click outside the area
        document.addEventListener('keydown', this.keydownListener);
        // add the listener with a slight delay to ensure it is added after the content is displayed
        // and not triggered immediately after
        setTimeout(() => {
            document.addEventListener("click", this.closeOnOutsideClickListener);
        }, 0);

    }

    closeWindow(content) {
        content.classList.add("hidden")
        content.blur()
        if (this.keydownListener) {
            document.removeEventListener("keydown", this.keydownListener);
            this.keydownListener = null; // Clear the reference
        }

        if (this.closeOnOutsideClickListener) {
            document.removeEventListener("click", this.closeOnOutsideClickListener);
            this.closeOnOutsideClickListener = null; // Clear the reference
        }
    }
}