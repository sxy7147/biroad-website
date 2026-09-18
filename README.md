# BiRoAD project website

A standalone, dependency-free research website for **BiRoAD: Learning Shared and Role-Adaptive Representations for Bimanual Manipulation**. All images, fonts (system font stack), videos, and the paper are local; the page needs no third-party services or build step.

## Preview

From this folder:

```sh
python3 -m http.server 8057 --bind 127.0.0.1
```

Open http://127.0.0.1:8057/. Opening `index.html` directly also displays the site, but citation clipboard access may require HTTP localhost or HTTPS.

## Publish with GitHub Pages

Use this folder's **contents** as the root of a dedicated website repository (suggested name: `biroad`). Keep `.nojekyll` alongside `index.html`. Do not upload the parent training repository, local evidence directory, or original video archive.

1. Create or select the intended GitHub repository, then commit/push this folder's contents to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then **main** and **/(root)**; save.
4. Open the URL shown in Pages once deployment completes. For a project repository it normally has the form `https://OWNER.github.io/REPOSITORY/`.

Every asset path is relative, so no code change is required for a repository-name prefix. No custom domain, remote repository, publishing workflow, analytics, or external font service has been configured.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Content and assets

- `index.html`: paper title, authors, overview, abstract summary, method, five paired real-world tasks, citation.
- `styles.css`: responsive desktop/mobile presentation.
- `script.js`: paired play/pause/restart controls and citation copy.
- `assets/paper/biroad.pdf`: exact copy of the supplied `_CoRL__BiRoAD-19.pdf`.
- `assets/images/overview.png` and `method.png`: Figures 1 and 2 cropped directly from that PDF.
- `assets/videos/overview.mp4`: supplied `supp/video.mp4`, remuxed for fast-start playback without recompression or a speed change.
- `assets/videos/random/` and `symmetric/`: H.264/AAC browser copies of the paired experimental clips. These already encode 3× recorded speed; browser playback stays at `1.0`.

| Task | Scene A source | Scene B source |
|---|---|---|
| Bouquet handover | `random/bouque_v1.mp4` | `symmetric/bouque_1_v1.mp4` |
| Put banana into drawer | `random/drawer_v1.mp4` | `symmetric/drawer_1_v1.mp4` |
| Open bottle cap | `random/bottle_v1.mp4` | `symmetric/bottle_1_v1.mp4` |
| Sweep to dustpan | `random/sweep_v1.mp4` | `symmetric/sweep_1_v1.mp4` |
| Pour water | `random/pour_v1.mp4` | `symmetric/pour_1_v1.mp4` |

The requested `symmetric/bottle_1_v1.mp4` was first generated beside the original `bottle_1.mp4` using video `setpts=(PTS-STARTPTS)/3` and audio `atempo=1.5,atempo=2.0`. The original was retained. All other `_v1` clips retain their existing timeline duration. Source spelling `bouque` is preserved in filenames; the visible task name is “Bouquet handover”.

Videos do not autoplay and use `preload="none"`. The pair buttons operate both clips, while native controls remain available per clip. Clips retain individual durations. Pairs pause when their section leaves the viewport or the browser tab is hidden. Without JavaScript, all paper content and the individual video controls remain usable.

## Updating publication information

The supplied paper is the content source. The author confirmed acceptance to CoRL 2026; the citation uses `@inproceedings`, `booktitle = {Proceedings of the Conference on Robot Learning (CoRL)}`, and `year = {2026}`. No DOI, page numbers, or proceedings volume is assumed. The Results section was removed at the author's request. Figure 1 uses the paper's full caption.

Verified homepage links are attached only to Yan Shen, Xiaoqi Li, Ruihai Wu, and Hao Dong:

- Yan Shen: https://sxy7147.github.io/
- Xiaoqi Li: https://clorislili.github.io/clorisLi/
- Ruihai Wu: https://warshallrho.github.io/
- Hao Dong: https://zsdonghao.github.io/

An existing GitHub account is sufficient for GitHub Pages. A separate project repository can host this website without replacing that account's personal homepage.
