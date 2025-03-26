javascript:(function() {
    /* Best for dependabot PRs: helps you get to the approve button faster */
    /* Click "Files Changed" tab using the specific selector */
    const filesTab = document.querySelector('a[href*="/files"][data-turbo-frame="repo-content-turbo-frame"]');
    if (filesTab) filesTab.click();

    /* Wait for the review button to be available and click it */
    setTimeout(() => {
        const reviewButton = document.querySelector('#overlay-show-review-changes-modal');
        if (reviewButton) reviewButton.click();

        /* Wait for the review dialog to open */
        setTimeout(() => {
            /* Write "@dependabot merge" in the text area */
            const textArea = document.querySelector('#pull_request_review_body');
            if (textArea) {
                textArea.value = '@dependabot merge';
                /* Trigger an input event to ensure GitHub's JS picks up the change */
                textArea.dispatchEvent(new Event('input', { bubbles: true }));
            }

            /* Select "Approve" radio using its specific ID */
            const approveRadio = document.querySelector('#pull_request_review\\[event\\]_approve');
            if (approveRadio) approveRadio.click();
        }, 1000);
    }, 1000);
})();
