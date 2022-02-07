# RTL-DC-Motor

• Faculty: Aftab Hussain

• TA: Navnit

In this project, a system will be created to measure the speed of a DC motor for an applied input voltage. The students are expected to plot speed vs voltage for no load operation and compare with theoretical expectations. Further, the power consumed by the motor can be calculated using the current and voltage inputs.

## Installations

### Node

- For Linux:

```
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs
```

- For Mac:

```
brew install node
```

### MongoDB

Install the community edition [here](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials).

### React

```
npm install -g create-react-app
```

## Running the boilerplate

- Run Mongo daemon:

```
sudo mongod
```

Mongo will be running on port 27017.

- Run Express Backend:

```
cd backend/
npm install
npm start
```

- Run React Frontend:

```
cd frontend
npm install/
npm start
```

Navigate to [http://localhost:3000/](http://localhost:3000/) in your browser.
