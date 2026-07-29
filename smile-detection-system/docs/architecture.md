```mermaid
flowchart LR
    User[User] --> Frontend[React + Vite]
    Frontend --> API[FastAPI]
    API --> DB[(PostgreSQL)]
    API --> AI[Smile Detection Service]
```
