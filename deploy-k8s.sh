#!/bin/bash

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Déploiement K3s ===${NC}\n"

# 1. Build les images Docker
echo -e "${YELLOW}1. Construction des images Docker...${NC}"
docker build -t simple-app-backend:latest ./backend
docker build -t simple-app-frontend:latest ./frontend
echo -e "${GREEN}✓ Images créées${NC}\n"

# 2. Vérifier que K3s/kubectl est en cours d'exécution
echo -e "${YELLOW}2. Vérification de K3s...${NC}"
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}✗ kubectl non trouvé${NC}"
    exit 1
fi

if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}✗ K3s ne répond pas${NC}"
    exit 1
fi
echo -e "${GREEN}✓ K3s est actif${NC}\n"

# 3. Appliquer les manifests Kubernetes
echo -e "${YELLOW}3. Déploiement sur K3s...${NC}"
kubectl apply -f k8s/app-deployment.yaml
echo -e "${GREEN}✓ Manifests appliqués${NC}\n"

# 4. Attendre que les pods soient prêts
echo -e "${YELLOW}4. Attente du démarrage des pods (30 secondes)...${NC}"
sleep 10
echo -e "${GREEN}✓ Vérification du statut${NC}\n"

# 5. Afficher le statut
echo -e "${YELLOW}5. Statut des déploiements:${NC}"
kubectl get deployments
echo ""
kubectl get pods
echo ""

# 6. Afficher les services
echo -e "${YELLOW}6. Services:${NC}"
kubectl get services
echo ""

# 7. Obtenir l'IP pour accéder à l'application
echo -e "${YELLOW}7. Points d'accès:${NC}"

# Avec K3s, obtenir l'IP du nœud
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="ExternalIP")].address}')
if [ -z "$NODE_IP" ]; then
    NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')
fi

if [ -z "$NODE_IP" ]; then
    NODE_IP="localhost"
fi

echo -e "${GREEN}✓ Frontend: http://${NODE_IP}:30080${NC}"
echo -e "${GREEN}✓ Backend (interne): http://backend-service:3000${NC}"
echo ""
echo -e "${YELLOW}Commandes utiles:${NC}"
echo -e "  Voir les logs backend:   ${YELLOW}kubectl logs -f deployment/backend${NC}"
echo -e "  Voir les logs frontend:  ${YELLOW}kubectl logs -f deployment/frontend${NC}"
echo -e "  Accéder au pod:          ${YELLOW}kubectl exec -it <pod-name> -- sh${NC}"
echo -e "  Supprimer déploiement:   ${YELLOW}kubectl delete -f k8s/app-deployment.yaml${NC}"
