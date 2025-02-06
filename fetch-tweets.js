async function fetchTweets() {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT0AxDpwUVLxm0nyyFo0unE5AxyE4Tou3wz4L-oLecdKtOT-cSpKS7QmSgqraHtpiGDisSd_lOCOUpk/pub?output=csv";

    try {
        let response = await fetch(sheetUrl);
        let csvData = await response.text();

        let rows = csvData.trim().split("\n"); // ✅ Split into rows
        let last10Rows = rows.slice(-10); // ✅ Fetch last 10 entries
        
        let tweetContainer = document.getElementById("tweet-container");
        tweetContainer.innerHTML = ""; // Clear previous tweets
        
        last10Rows.reverse().forEach(row => {
            let columns = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g); // ✅ Handles commas inside quoted text
            let tweetDate = columns[0].replace(/"/g, '').trim(); // ✅ Ensures clean timestamp
            let tweetText = columns.slice(1).join(",").replace(/"/g, '').trim(); // ✅ Ensures full tweet text is displayed

            let tweetElement = document.createElement("div");
            tweetElement.className = "tweet";
            tweetElement.innerHTML = `
                <p>${tweetText}</p>
                <p class="timestamp">${tweetDate}</p>
            `;
            tweetContainer.appendChild(tweetElement);
        });

        // ✅ Store tweets in localStorage for backup
        localStorage.setItem("cachedTweets", JSON.stringify(last10Rows));
    } catch (error) {
        console.error("Error fetching tweets:", error);
        
        // ✅ Load cached tweets if available
        let cachedTweets = localStorage.getItem("cachedTweets");
        if (cachedTweets) {
            let tweets = JSON.parse(cachedTweets);
            let tweetContainer = document.getElementById("tweet-container");
            tweetContainer.innerHTML = "";

            tweets.forEach(row => {
                let columns = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g);
                let tweetDate = columns[0].replace(/"/g, '').trim();
                let tweetText = columns.slice(1).join(",").replace(/"/g, '').trim();

                let tweetElement = document.createElement("div");
                tweetElement.className = "tweet";
                tweetElement.innerHTML = `
                    <p>${tweetText}</p>
                    <p class="timestamp">${tweetDate}</p>
                `;
                tweetContainer.appendChild(tweetElement);
            });
        } else {
            document.getElementById("tweet-container").innerHTML = "Failed to load tweets.";
        }
    }
}

// ✅ Auto-refresh tweets every 10 minutes (600,000ms)
fetchTweets();
setInterval(fetchTweets, 600000);
