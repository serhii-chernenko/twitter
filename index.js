const delay = () => new Promise(proceed => setTimeout(proceed, 2000));

const scrollDown = async () => {
    const prevScrollTop = document.documentElement.scrollTop;

    window.scrollTo(0, document.body.scrollHeight);
    await delay();

    if (document.documentElement.scrollTop === prevScrollTop) {
        return console.log('%cDone!', 'color:green');
    }

    return twitterUnfollowAllWithoutMutualSubscription();
};

const twitterUnfollowAllWithoutMutualSubscription = async () => {
    const FOLLOWS_TEXT_EN = 'Follows you';
    const FOLLOWS_TEXT_RU = 'Читает вас';
    const unfollowButtons = document.querySelectorAll('[role="button"][data-testid*="unfollow"]');

    if (!unfollowButtons.length) {
        return console.log('%cList is empty!', 'color:red');
    }

    for (const button of Array.from(unfollowButtons)) {
        const spans = button.parentElement.previousElementSibling.querySelectorAll('span');

        if (!spans.length) continue;

        const nicknameIndex = Array.from(spans).findIndex(span => span.innerText.match('@'));
        const followsMeSpanIndex = Array.from(spans).findIndex(
            span => span.innerText === FOLLOWS_TEXT_EN || span.innerText === FOLLOWS_TEXT_RU
        );

        if (!nicknameIndex && !followsMeSpanIndex) continue;

        const nickname = spans[nicknameIndex];
        const isFollowMe = spans[followsMeSpanIndex];

        if (isFollowMe) continue;

        button.click();

        const confirmationButton = document.querySelector('[data-testid="confirmationSheetConfirm"]');

        if (!confirmationButton) continue;

        confirmationButton.click();

        console.log(`Unfollowed %c${nickname.innerText}!`, 'color:blue');
    }

    await delay();
    return scrollDown();
};

twitterUnfollowAllWithoutMutualSubscription();
