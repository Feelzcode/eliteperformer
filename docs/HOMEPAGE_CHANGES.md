# Elite Performers — Homepage copy & section changes

**Project:** `elite-performers-nextjs/elite-performers`  
**File:** `components/site/HomePage.jsx` (+ `home.css` for playbook cards)  
**Date:** September 2026  

Log of marketing homepage edits so we can restore or re-enable sections later.

---

## Hero / subheadline

| Before | After |
|--------|--------|
| A 2 hour live webinar on How I Built a 6-Figure Airbnb Business Without Owning Property or Using My Own Money. | **Using NONE of your own money to start!** |

---

## Playbook section

| Before | After |
|--------|--------|
| **H2:** Three moves, in order | **H2:** The Exact Playbook To Control Cash-Flowing Real Estate Without Owning A Single Property |
| **Sub:** Skip any one of these and the model breaks. Here's the sequence, previewed free. | **Sub:** (Here's A Preview Of What You'll Learn For FREE) |

### Three playbook cards

Replaced numbered 01/02/03 title+body steps with checkmark cards (styled in `home.css` to match the reference layout).

| # | Before | After |
|---|--------|--------|
| 1 | Find the deal — How to identify high-margin arbitrage units… | **How to find high profit deals in your area** |
| 2 | Secure the unit — Structure a 0%-interest agreement… | **Secure funding at 0% interest to control these units using none of your own money** |
| 3 | Automate the income — Set up systems so the unit runs itself… | **Automate your property and achieve passive rental income every month** |

---

## Video sections

- **Kept:** first `VideoBlock` (admin `video1*` fields) + CTA under it.
- **Hidden (commented in JSX):** second `VideoBlock` (`video2*`) + its CTA.

Admin can still configure video 2 in the CMS; it will not render until the comment block in `HomePage.jsx` is restored.

---

## Removed from homepage

### As Seen On… (press logos)

Fully **removed** (not commented):

- Label: As Seen On...
- Logos: Forbes, BiggerPockets, Business Insider, Rental Scale-Up, Skift

To bring back, restore a `.press` block similar to the previous markup and the `.press` / `.press-logos` styles in `home.css` (styles may still be present).

---

## Commented out (available for future)

### Revealed Live / 4 Secrets

Section starting with:

- Label: **Revealed Live On This Free Workshop**
- H2: **The 4 Secrets That Turn Years Of Wondering "What If" Into Your First Cash-Flowing Airbnb In 2026**
- Cards: Secret #1 … Secret #4

Both the JSX block and the `SECRETS` data array are commented in `HomePage.jsx`. Uncomment **both** together to restore.

---

## How to re-enable

1. Open `components/site/HomePage.jsx`.
2. Search for `Second video block` or `4 Secrets`.
3. Remove the surrounding `{/* … */}` (and restore the `SECRETS` const for secrets).
4. Refresh the homepage.

---

## Still visible (unchanged in this pass)

- Why-this-workshop banner + first video + CTA  
- Testimonials / proof  
- FAQ  
- Closing CTA / sticky CTA / registration modal  
