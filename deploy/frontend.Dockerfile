# Alternative for a small server: build frontend/dist locally before uploading.
# Run from the project root: docker build -f deploy/frontend.Dockerfile -t maqas-frontend ./frontend
FROM nginx:stable-alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
