<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

<!--- ## Deployment -->

>This project is deployed as a static website to GitHub Pages.

>Important:
>- Production domain: jankech.cz
>- Keep the site compatible with static hosting.
>- Do not introduce server-side dependencies unless specifically requested.
>- GitHub Actions builds and deploys the site from main.
>- Contact forms use Formspree.
>- Static images used in production should be stored locally in /public.
>- Do not replace local image paths with Lovable /__l5e/ asset URLs.
>- Do not remove or overwrite the GitHub Pages deployment workflow.
