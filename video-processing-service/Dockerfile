# node image
From node:18

# set the working directory in the container to /app
WORKDIR /app

# copy package.json and package-lock.json into working directry
COPY package*.json ./

# install any needed package
RUN apt-get update && apt-get install -y ffmpeg

# install npm package
RUN npm install

# Copy app source inside the docker image
COPY . .

# Make port 3000 availabe outside the container
EXPOSE 3000

# Define the run command
CMD ["npm","start"]