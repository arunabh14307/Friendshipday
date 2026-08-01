# 💜 FriendVerse — Premium Friendship Day Web Experience

FriendVerse is an Apple-level, visually stunning, modern digital Friendship Day web application. It features dynamic 3D cards, custom secret scratch card reveal, interactive virtual gift opening, official diploma certificate with badges, and background acoustic guitar melodies.

---

## 🚀 Deploying to Render (Step-by-Step)

Follow these simple steps to deploy **FriendVerse** live on [Render](https://render.com) for free:

### Option 1: Render Static Site (Recommended)

1. Push your repository to **GitHub** (or **GitLab**).
2. Go to [dashboard.render.com](https://dashboard.render.com/) and click **New +** → **Static Site**.
3. Connect your **GitHub repository**.
4. Configure the following settings:
   - **Name**: `friendverse` (or your preferred name)
   - **Branch**: `main` or `master`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Click **Create Static Site**. Render will automatically build and deploy your app with a free HTTPS URL!

### Option 2: Render Blueprint (1-Click YAML)

1. Go to [dashboard.render.com](https://dashboard.render.com/) and click **New +** → **Blueprint**.
2. Connect your GitHub repository. Render will automatically read `render.yaml` and configure the static web service for you!

---

## 🛠️ Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```
