# BeCampusX

## How to Run using CX-Shell : METHOD 1

> Windows

**SETUP Shell**
```
touch ~/.bashrc
pwd # Now put pwd path into cx
echo "alias cx='${YOUR_PWD_PATH}/start.sh'" >> ~/.bashrc
source ~/.bashrc

```
> RUN Backend and Frontend using CX Shell
**For Shell (help)**
```
cx
```
**For backaned and Frontend (with services)** <br/>
> Usage: ***cx [service-name]***
```
EXAMPLE:
cx backend         → Start backend
cx fe              → Start frontend
cx fe-admin        → Start frontend admin
cx fe-provider     → Start frontend provider
cx fe-supervisor   → Start frontend supervisor
cx all             → Start all services
```

## RUN using Start Script : METHOD 2 
> Usage: ***./start.sh [service-name]***
```
./start.sh    # For Help
```
**To Run Backend & Frontend (with services)**
```
EXAMPLE:
./start.sh backend         → Start backend
./start.sh fe              → Start frontend
./start.sh fe-admin        → Start frontend admin
./start.sh fe-provider     → Start frontend provider
./start.sh fe-supervisor   → Start frontend supervisor
./start.sh all             → Start all services
```
#### Or you can run Manually using pnpm

***CampusX by Adnan Khan && Garv Thakre***