# LeaveManager — Web

![CI](https://github.com/terroyassine-design/leavemanager-web/actions/workflows/ci.yml/badge.svg)

Interface React de LeaveManager : **un employé pose ses congés, son manager les valide ou les refuse.**

> API Spring Boot : [leavemanager-api](https://github.com/terroyassine-design/leavemanager-api)

## Démo

Comptes de démo (mot de passe `Demo1234!`, profil en lecture seule) :

| Rôle | Email |
|---|---|
| Manager | `manager@demo.com` |
| Employé | `employee@demo.com` |

| Écran | Rôle | Contenu |
|---|---|---|
| Connexion / Inscription | public | Formulaires avec erreurs de validation renvoyées par l'API |
| Mes congés | tous | Solde, formulaire de demande, historique avec statut et commentaire du manager |
| Validation | Manager | Demandes de l'équipe filtrées par statut, validation ou refus avec commentaire |
| Mon profil | tous | Modification du nom et de l'email, changement de mot de passe (en lecture seule pour les comptes de démo) |

## Stack

| Domaine | Technologies |
|---|---|
| UI | React 19, TypeScript, Tailwind CSS 4 |
| Design system | [shadcn/ui](https://ui.shadcn.com) (composants accessibles basés sur Radix UI), icônes Lucide, notifications Sonner, mode sombre |
| Navigation | React Router (routes protégées par rôle) |
| Données serveur | TanStack Query (cache, rechargement après chaque action) |
| Tests | Vitest, Testing Library |
| Qualité | oxlint, TypeScript strict |
| CI/CD | GitHub Actions, déploiement Vercel |

## Organisation du code

```
src/
├── api/         appels HTTP : client.ts (JWT + erreurs), auth.ts, leaves.ts
├── auth/        session : AuthProvider (token + utilisateur), useAuth, RequireAuth
├── components/
│   ├── ui/      composants du design system (générés par shadcn/ui)
│   └── …        composants métier (LeaveForm, LeaveDecisionCard, StatusBadge…)
├── pages/       un fichier par écran (chargé à la demande)
├── lib/         formatage des dates et libellés en français, utilitaire cn()
└── types.ts     types TypeScript identiques aux réponses de l'API
```

### Comment circulent les données

1. Un composant appelle `useQuery` (lecture) ou `useMutation` (écriture) de TanStack Query.
2. La fonction de `src/api/` appelle `apiFetch`, qui ajoute l'en-tête `Authorization: Bearer <token>`.
3. Si l'API renvoie une erreur, `apiFetch` lève une `ApiError` avec le message et les erreurs par champ, affichés tels quels dans l'interface.
4. Après une action (nouvelle demande, validation…), `invalidateQueries(['leaves'])` recharge automatiquement les listes concernées.

### Sécurité côté interface

- Le JWT est stocké dans `localStorage` et envoyé à chaque requête.
- `RequireAuth` redirige vers `/login` si l'utilisateur n'est pas connecté, et `RequireAuth role="MANAGER"` protège l'écran de validation.
- Ce n'est qu'un confort d'affichage : **la vraie sécurité est dans l'API**, qui vérifie le token et le rôle à chaque requête.
- Si le token expire ou est révoqué (réponse 401), l'utilisateur est automatiquement déconnecté.
- Après un changement de mot de passe, l'API révoque tous les anciens tokens et en renvoie un nouveau, qui remplace l'ancien : la session en cours continue, les autres sont déconnectées.
- **Protection contre le XSS :** React échappe tout le texte affiché, et le code n'utilise jamais `dangerouslySetInnerHTML`. En défense en profondeur, [vercel.json](vercel.json) envoie une **Content-Security-Policy** stricte (aucun script inline ni externe, connexions limitées à l'API), ainsi que `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` et `Permissions-Policy`.
- Le script qui applique le thème avant l'affichage ([public/theme-init.js](public/theme-init.js)) est un fichier séparé, et non un script inline, précisément pour respecter cette CSP.

> ⚠️ Au déploiement, remplacez `https://leavemanager-api.onrender.com` dans `connect-src` ([vercel.json](vercel.json)) par l'URL réelle de l'API, sinon le navigateur bloquera les appels.

## Design system

L'interface repose sur **shadcn/ui** : les composants (Button, Card, Select, Tabs, DropdownMenu…) sont copiés dans `src/components/ui/` et font partie du code du projet. Ils s'appuient sur **Radix UI** pour l'accessibilité : navigation au clavier, attributs ARIA et gestion du focus.

**Les tokens** sont définis dans [src/index.css](src/index.css). Les composants n'utilisent jamais de couleur brute (`teal-700`, `#fff`…), uniquement des couleurs sémantiques :

| Token | Rôle |
|---|---|
| `primary` / `accent` | Couleur de marque (turquoise), boutons principaux, éléments actifs |
| `success` / `warning` / `destructive` | Statuts des demandes et messages d'erreur |
| `background` / `card` / `muted` / `border` | Surfaces et textes secondaires |
| `panel` | Panneau de marque de l'écran de connexion |
| `radius` | Arrondi de base, décliné de `sm` à `4xl` |

Chaque token a une valeur pour le mode clair (`:root`) et pour le mode sombre (`.dark`). Changer la marque ou le thème ne demande de modifier **qu'un seul fichier**.

Pour ajouter un composant au design system :

```bash
npx shadcn@latest add dialog
```

## Lancer le projet en local

Prérequis : Node.js 24 et l'API démarrée sur `http://localhost:8080` (voir son README).

```bash
npm install
npm run dev
```

L'application est disponible sur http://localhost:3000 (l'API autorise cette origine par défaut, via `CORS_ALLOWED_ORIGINS`).

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm test` | Tests unitaires et de composants |
| `npm run lint` | Analyse statique |
| `npm run build` | Vérification TypeScript + build de production dans `dist/` |

## CI/CD

- **CI** ([.github/workflows/ci.yml](.github/workflows/ci.yml)) : lint, tests et build à chaque push ou pull request.
- **CD** : Vercel déploie automatiquement chaque push sur `main`. La variable `VITE_API_URL` pointe vers l'API en production, et [vercel.json](vercel.json) renvoie toutes les URL vers `index.html` pour que React Router gère la navigation.
