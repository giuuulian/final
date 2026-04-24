
## Description du projet
Ce projet est une application web simple composée de deux parties :

- Un backend Node.js/Express qui expose une API REST pour gérer une liste de messages.
- Un frontend statique qui consomme cette API.

C'est une architecture de base backend + frontend, conteneurisée avec Docker, et déployable soit en local avec Docker Compose, soit sur Kubernetes (K3s).

## Explication du pipeline CI/CD


Le backend et le frontend sont construits en images Docker (`simple-app-backend:latest` et `simple-app-frontend:latest`).

Le backend expose un endpoint `/health` utilisé pour vérifier que le service est prêt.

Le frontend est exposé en NodePort (`30080`) et communique avec le backend via le service Kubernetes (`backend-service`).

Remarque : il n’y a pas de workflow CI distant (GitHub Actions, GitLab CI, etc.) dans ce dépôt. Le pipeline actuel est exécuté localement via script et commandes Docker/Kubernetes.

## Étapes de déploiement

### Option 1 : Déploiement local avec Docker Compose
Depuis la racine du projet :

```bash
docker compose up --build -d
```

Vérifier l’état :

```bash
docker compose ps
```

Accès :

- Frontend : http://localhost:8080
- Backend : http://localhost:3000
- Healthcheck backend : http://localhost:3000/health

Arrêter :

```bash
docker compose down
```

### Option 2 : Déploiement Kubernetes (K3s)
Prérequis : Docker et `kubectl` installés, cluster K3s actif.

Depuis la racine du projet :

```bash
bash deploy-k8s.sh
```

Le script :

- construit les images Docker,
- vérifie l’accès au cluster,
- applique les manifests Kubernetes,
- affiche le statut des déploiements, pods et services.

Accès frontend (NodePort) :

- http://<IP_DU_NOEUD>:30080

Commandes utiles :

```bash
kubectl get deployments
kubectl get pods
kubectl get services
kubectl logs -f deployment/backend
kubectl logs -f deployment/frontend
kubectl delete -f k8s/app-deployment.yaml
```
