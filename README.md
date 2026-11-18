# Anime Log: notes from Franky 🔧

## What Julian asked for
I could only find the **ChatGPT** conversation ("Build anime tracker app", Oct 24, 2026). Here's the prompt word for word:

> make me an app I can use to track and catalogue the anime I have watched. The app should have the following functionality:
> - Runs on iPhone
> - Has a 'library' that stores all anime I've entered
> - There should be an 'add' function where I can search for and select an anime to add to my library
> - Each anime entry should have the following data: name · release year · designation as to whether its a film, OVA, TV series, etc. · number of episodes · the official theatrical poster or splash art for it's icon in app
> - The library should have the ability to sort by release date, alphabetically, designation (as described above) or by number of episodes (ascending or descending)

That was the only message. There were no follow-up prompts.

**Gemini:** the two "gemini export" zips don't include any chats. Part 1 only has the Takeout index page. Part 2 has an empty Gems file and one scheduled action ("Daily Japanese lesson"). Google Takeout puts Gemini chats under **My Activity → Gemini Apps**, and that wasn't part of this export. So I couldn't see Gemini's prompt or the app it made. If you export that and drop it in the folder, I'll fold in anything good from it.

## What ChatGPT made: "Anime Archive" (an iPhone web app you add to your Home Screen)
The project zip didn't come through in the export. I worked from its README and its chat summary:
- Searches the Jikan API (MyAnimeList data) and adds the title, release year/date, format, episode count and poster
- 8 sort options: release newest/oldest, A–Z/Z–A, designation, episodes low/high
- Library search, remove, summary counts (titles, episodes, films), JSON export/import with merge
- Works offline once installed (service worker), with a Home Screen icon. You host it on GitHub Pages and add it from Safari
- **Strengths:** covered every requirement, got the platform right for an iPhone (a web app, no App Store needed), had backups, and was honest about poster accuracy
- **Weaknesses:** it only catalogued titles. There was no watch status, episode progress, rating or notes. It relied on a single API (ChatGPT itself couldn't reach Jikan when testing, so search was never tested). There was no manual entry for obscure titles, no bulk import, and it wouldn't work without hosting

## What the new app (Anime Log) takes and adds
**Kept from ChatGPT:** the same platform (iPhone web app, Add to Home Screen), Jikan/MyAnimeList as the main catalogue, all 8 required sorts, library search, stats, JSON export/import with merge, offline support, honest poster sourcing.

**Improvements:**
1. **Watch tracking:** Watching / Completed / Plan to Watch / On Hold / Dropped, with filter chips and counts
2. **Episode progress:** ± buttons on the card and in the detail view. Reaching the last episode marks the show completed
3. **Rating out of 10, notes, favourites, start/finish dates, rewatch count**
4. **Backup catalogue:** if Jikan is down, it automatically switches to AniList (you can change this in Settings)
5. **Manual add + your own poster photo** for obscure OVAs that aren't in any catalogue (your to-watch list has a lot of these)
6. **Bulk add:** paste a list of titles. They're added straight away and matched to posters and details in the background
7. **Your "Every Anime Ever" sheet is ready to import:** `starter-library-from-every-anime-ever.json` has 580 titles (378 completed, 175 plan to watch, 7 watching, 20 on hold). The "Watching v2" details and the to-watch links are carried over into notes
8. **Re-match** any entry that matched the wrong show, plus **Edit details** to fix the year, type or episode count by hand
9. **Two extra sorts:** recently updated and my rating. You can also filter by designation, search covers genres, studios and notes, and there's a grid/list toggle
10. **Better stats:** episodes watched, estimated days watched, average rating, and breakdowns by status, designation, decade and genre, plus your top rated
11. **CSV export** (opens in Sheets), backup reminder, light/dark/system theme
12. **Works as one file:** `index.html` runs on its own, even opened directly. The other files only add Home Screen install and offline poster caching when hosted

## How to use it
**Quick test:** open `index.html` in any browser.

**Install on iPhone (recommended):**
1. Put the contents of `anime-log.zip` (index.html, manifest.webmanifest, sw.js, the icon PNGs) on any HTTPS static host. GitHub Pages works: make a repo, upload the files, then turn on Settings → Pages → main / root. Netlify Drop also works: drag the folder onto app.netlify.com/drop
2. Open the URL in **Safari**, then tap Share → **Add to Home Screen**
3. Open the app from the new icon → **Settings → Import…** → choose `starter-library-from-every-anime-ever.json` (save it to Files first) → **Match unmatched titles**. That takes about 1 second per title, so roughly 10 minutes for all 580. You can keep using the app while it runs, and **Stop** whenever you want
4. Titles marked ⚠︎ didn't find a match. Open one and use **Re-match** or **Edit details**. Western shows (Invincible, Castlevania, Arcane, Blue Eye Samurai) aren't in the anime catalogues, so set their posters by hand

**Data:** everything stays on your phone (localStorage). Use **Export JSON** now and then and keep the file in iCloud Drive. To move to a new device, import that file.

## Caveats
- Posters come from MyAnimeList or AniList key art. That's usually the official poster, but not always the theatrical one-sheet
- Auto-matching chooses the TV series or the earliest release when a title is ambiguous. Check sequels and franchises (for example, JoJo matched the 1993 OVA)
- AniList's API terms limit its use in competing tracker *services*. That's why Jikan is the default and AniList is only the backup for this personal, on-device app
