#!/bin/bash
# dev-commands -> |-| chmod +x start.sh |-| ./start.sh |-| 
set -e

#===========================
# C: COLORS
#===========================
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[1;34m"
CYAN="\033[1;36m"
BOLD="\033[1m"
RESET="\033[0m"

#===========================
# H: HEADER
#===========================
echo -e "${CYAN}${BOLD}"
echo "======================================================"
echo " >> Service Starter Script | CampusX | CX-Shell   "
echo "======================================================"
echo -e "${RESET}"

#===========================
# Ch: CHECKS
#===========================
if ! command -v pnpm &> /dev/null; then
  echo -e "${RED}✖ Error:${RESET} pnpm is not installed. Please install it first."
  exit 1
fi

SERVICE=$1

#===========================
# UF: USAGE FUNCTION
#===========================
usage() {
  echo -e "${YELLOW}Usage:${RESET} ${BOLD}cx [service-name]${RESET}"
  echo
  echo -e "Available services:"
  echo -e "  ${GREEN}backend${RESET}         → Start backend"
  echo -e "  ${GREEN}fe${RESET}              → Start frontend"
  echo -e "  ${GREEN}fe-admin${RESET}        → Start frontend admin"
  echo -e "  ${GREEN}fe-provider${RESET}     → Start frontend provider"
  echo -e "  ${GREEN}fe-supervisor${RESET}   → Start frontend supervisor"
  echo -e "  ${GREEN}all${RESET}             → Start all services"
  echo
  echo -e "Example: ${YELLOW}cx fe-admin${RESET}"
  echo -e "${BLUE}If not work use start sript: replace cx with ./start.sh"
  exit 1
}

if [ -z "$SERVICE" ]; then
  usage
fi

#===========================
# SERVICE STARTERS
#===========================
start_service() {
  local name=$1
  local dir=$2

  echo -e "${BLUE}➡ Starting ${BOLD}${name}${RESET}..."
  cd "$dir" || { echo -e "${RED}✖ Failed:${RESET} $dir not found"; exit 1; }

  echo -e "${YELLOW}📦 Installing dependencies...${RESET}"
  pnpm install

  echo -e "${GREEN}🚀 Launching ${name}...${RESET}"
  pnpm dev &

  cd - > /dev/null
  echo -e "${GREEN}✔ ${name} started successfully${RESET}\n"
}

#===========================
# SERVICE HANDLERS
#===========================
case "$SERVICE" in
  backend)        start_service "Backend" "backend" ;;
  fe)             start_service "Frontend" "frontend" ;;
  fe-admin)       start_service "Frontend Admin" "frontend-admin" ;;
  fe-provider)    start_service "Frontend Provider" "frontend-provider" ;;
  fe-supervisor)  start_service "Frontend Supervisor" "frontend-supervisor" ;;
  all)
    echo -e "${CYAN}⚡ Starting all services in parallel...${RESET}\n"
    start_service "Backend" "backend"
    start_service "Frontend" "frontend"
    start_service "Frontend Admin" "frontend-admin"
    start_service "Frontend Provider" "frontend-provider"
    start_service "Frontend Supervisor" "frontend-supervisor"
    wait
    echo -e "${GREEN}✅ All services are up and running!${RESET}"
    ;;
  *)
    usage
    ;;
esac
