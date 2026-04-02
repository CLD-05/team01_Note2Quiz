# ---- 1단계: 빌드 ----
    FROM node:22-alpine AS build
    WORKDIR /app
    
    # 의존성 캐싱: package 파일만 먼저 복사
    COPY package*.json ./
    RUN npm ci
    
    # 소스 복사 후 빌드
    COPY . .
    RUN npm run build
    
    # ---- 2단계: 실행 (Nginx로 정적 파일 서빙) ----
    FROM nginx:alpine
    COPY --from=build /app/dist /usr/share/nginx/html
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    EXPOSE 80