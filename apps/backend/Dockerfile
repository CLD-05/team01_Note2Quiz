# ---- 1단계: 빌드 ----
    FROM maven:3.9-eclipse-temurin-17 AS build
    WORKDIR /app
    
    # 의존성 캐싱: pom.xml만 먼저 복사하여 의존성 다운로드
    COPY pom.xml .
    RUN mvn dependency:go-offline -B
    
    # 소스 복사 후 빌드 (테스트 스킵)
    COPY src ./src
    RUN mvn package -DskipTests -B
    
    # ---- 2단계: 실행 ----
    FROM eclipse-temurin:17-jre
    WORKDIR /app
    COPY --from=build /app/target/*.jar app.jar
    
    EXPOSE 8080
    ENTRYPOINT ["java", "-jar", "app.jar"]