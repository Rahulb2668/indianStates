# All the Docker file should start with a base image.

FROM node:alpine

# Create a group and user to run the application with non-root privileges.
RUN addgroup app && adduser -S -G app app

# Set the working directory inside the container to /app.
WORKDIR /app

# Change the ownership of the working directory to the app user and group.
USER app

# Copy the package.json and package-lock.json files to the working directory.
COPY --chown=app:app package*.json ./

# Switch to the root user to change ownership of the files.
USER root
# Change the ownership of the working directory to the app user and group.
RUN chown -R app:app .
# Switch back to the app user to run the application with non-root privileges.
USER app
# Install the dependencies specified in the package.json file.
RUN npm install
# Copy the rest of the application code to the working directory.
COPY --chown=app:app . .
# Expose port 3000 to allow incoming traffic to the application.
EXPOSE 3000
# Set the default command to run the application in development mode when the container starts.
CMD ["npm", "run", "dev"]
