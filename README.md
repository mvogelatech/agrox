# AgroeXplore

* [Running GCP](https://agroxdev.rj.r.appspot.com/deploy-info)
* [User Story Map](https://atechcombr.sharepoint.com/sites/AgroX306/Shared%20Documents/General/User%20Story%20Map%20AgroX.pdf)
* [Figma (New)](https://www.figma.com/file/prOjj5kVoDkQNfMMmiIg2f/AgroX---v2---MVP60---MIX?node-id=0%3A1)
* [Figma (Old)](https://www.figma.com/proto/b6EFzMOpIpNkoxFpgvoNdQ/AgroX---v2---MVP60---MIX?node-id=472%3A2&scaling=scale-down)
* [Send FCM test notifications](https://console.firebase.google.com/u/0/project/agroxdev/notification/compose)
* [GCP production project](https://console.cloud.google.com/home/dashboard?project=agroexplore)
* [GCP development project](https://console.cloud.google.com/home/dashboard?project=agroxdev)

# Steps for daily development

## Preconditions

**1. Make sure you have followed the Development Environment Setup section first.**

**2. Make sure you have cloned the Repository from GitLab: `git clone https://scm.oktobyatech.com.br/pbarbosa/agro-x.git`.**

## 1. Make sure your dependencies and prisma config are up to date: `npm run sync`

This commmand will:

* Make sure the linters are up to date;
* Make sure the front-end dependencies are up to date (with `yarn`);
* Make sure the back-end dependencies are up to date (with `yarn`);
* Make sure the `@prisma/client` in the back-end is up to date;

## 2. Make sure your PostgreSQL Portable instance is running

## 3. Make sure you have an Android Virtual Device running (from Android Studio)

## 4. Make sure you have the `AGROX_DB_URL` environment variable pointing to your local PostgreSQL instance:

```
postgresql://postgres:09876senha54321@localhost:5432/agroxdb?schema=public
```

## 5. Make sure your database schema is up to date: `npm run sync-db`

This command will connect to your locally executing instance of PostgreSQL and overwrite your local database with fresh tables and data.

## 6. Start the back-end server with Nest: `npm run back`

## 7. Start the front-end development server with Expo: `npm run front`

Press `a` in the terminal running with Expo to launch the app into the AVD. This will take a while on the first run. Look at both the terminal and browser tab to follow the build status.

# Development Environment Setup

This section describes how to setup the development environment for AgroX. This should be done only once.

It is setup up in a way that makes it possible to use an Android Virtual Device to preview changes in the application in real-time by using Expo.

## Install and Configuration:

### Git

1. [Download](https://git-scm.com/) and install the lastest version.

### NodeJS

1. [Download](https://nodejs.org/en/download/) and install the lastest LTS version.

### Expo

1. Open a Terminal and run: `npm install expo-cli --global`

    Wait for the installation to finish. You can ignore any errors or warnings that appear during the installation as long as the installation process does not crash and that a message like `+ expo-cli@X.X.X` is displayed at the end.

2. Verify that the installation is successful with the command `expo-cli --version`, it should display a version and exit normally.

### Android Studio

1. [Download](https://developer.android.com/studio) and install the latest version.

2. Open Andriod Studio and in the launch screen select the **SDK Manager**: `Configure > SDK Manager`

3. Under the **SDK Platforms** tab, make sure you have one of the latest stable SDKs checked, for example:
    - [x] Android 9.0 (Pie) - API Level 28

4. Under the **SDK Tools** tab, make sure you have the following checked:
    - [x] Android Emulator
    - [x] Android SDK Platform-Tools
    - [x] Google Play Services
    - [x] Intel x86 Emulator Accelerator

5. With all selected items checked, click **Apply** to proceed with the download and installation.
    - Wait for the download and installation to finish and then click **Ok** on the **SDK Manager**

6. Still on the launch screen, select the **AVD Manager**: `Configure > AVD Manager`

    This is the manager that allows to create and launch virtual devices

7. On the bottom left corner click on **+ Create Virtual Device...**
    - On the next screen, it's possible to choose from several devices to create different ones of different sizes. It's *recommended* to choose one which has the **Play Store** installed.

8. Select a device and click **Next**:
    - [x] Phone - Pixel 2 - Size 5,0" - 1080x1920 - 420dpi

9. Download the latest stable Android Version to be used on the Device and click **Next**:
    - [x] Pie - API Level 28 - ABI x86 - Target Android 9.0 (GooglePlay)
    > This is a device image independent from the previously downloaded and installed SDK

10. Select an **AVD Name** and leave the rest settings as Default and click **Finish**

11. A new emulator has been created and can be started by clicking on the green play button on the Action column.

### Visual Studio Code (VSCode)

1. [Download](https://code.visualstudio.com/download) and install the latest version. Suggestion: use the User Installer because it does not require admin rights.

2. Install the extensions **Linter for XO** (from Sam Verschueren) and **Prettier** (from Esben Petersen)

3. Install the extensions **EditorConfig for VS Code** (from EditorConfig)

4. Install the editorconfig npm package globally: `npm install --global editorconfig`

5. Suggestion: also install an icon theme extension for VSCode:
	* *Material Icon Theme*, from Philipp Kief, or
	* *vscode-icons*, from VSCode Icons Team

6. Close and reopen VS Code to ensure the above changes take effect correctly

### PostgreSQL Portable

1. [Download PostgreSQL Portable](https://sourceforge.net/projects/postgresqlportable/) and unzip to a folder and execute the PostgreSQLPortable.exe to start the RDBMS.

2. Create the `agrodb` database by pasting directly into the PostgreSQL Portable prompt the following SQL commands:

```sql
ALTER ROLE postgres PASSWORD '09876senha54321';

DROP DATABASE IF EXISTS agrodb;

CREATE DATABASE agrodb
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

--GRANT TEMPORARY, CONNECT ON DATABASE agroxdb TO PUBLIC;
```

3. Create an environment variable for local database connection:

```
AGROX_DB_URL = postgresql://postgres:09876senha12345@localhost/agrodb?schema=public
```

### DBeaver

1. [Download DBeaver](https://dbeaver.io/) and install.

# Using DBeaver

## To access the local database

To access the local database (from PostgreSQL Portable) with DBeaver, simply create a new connection to `localhost:5432` with username `postgres` and password `09876senha12345`.

## To access the real database in Google Cloud

### First time preparation

1. Download `cloud_sql_proxy.exe` from [Cloud SQL Proxy](https://cloud.google.com/sql/docs/mysql/sql-proxy#install)
2. Go to [GCP > IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=agroxdev&supportedpurview=project) and open the App Engine default service account (`agroxdev@appspot.gserviceaccount.com`)
3. Go to *Add Key > Create new key > JSON*. This will generate a JSON file for you. Save this JSON file somewhere.

### Accessing

Initiate a Proxy SQL Server with `cloud_sql_proxy.exe` as follows:

```bash
cloud_sql_proxy.exe -instances=agroxdev:southamerica-east1:agrodb=tcp:5432 -credential_file=PATH/TO/THE/CREDENTIALS/JSON/FILE.json
# Example:
# cloud_sql_proxy.exe -instances=agroxdev:southamerica-east1:agrodb=tcp:5432 -credential_file=agroxdev-00b21a17b2d7.json
```

This will run a PostgreSQL server locally in port 5432 which will act as a proxy to the real server in the cloud.

In DBeaver, create a new connection to `localhost:5432` with the username and password for the real database.


# Running backend scripts to generate and parse spreadsheets for the prescription process:

## Environment requirements:

1. Python: install Pyton 3.x from [Download Python](https://www.python.org/):

2. Install poetry package manager, from [Poetry](https://python-poetry.org/):

```bash
# On windows open an elevated power shell and paste the following command:
(Invoke-WebRequest -Uri https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py -UseBasicParsing).Content | python
```
3. After executing steps 1 and 2 verify if python and poetry are on your system path.

4. Using poetry add all dependencies necessary for the script to run

```bash
# On backend / agrox-api / src / dev-scripts / python-area / folder execute the following commands to add necessary dependencies:
poetry install
```

5. Execute the generation scripts by using the following commands:

```bash
# On backend / agrox-api folder execute the following to generate spreadsheets for user id = 1
yarn prescription 1
```

# Steps to send a simple message notification

1. Open Postman or another HTTP request creation tool
2. Send a POST request to `https://agroxdev.rj.r.appspot.com/send-notification/simple-message` with the following JSON body:

	```jsonc
	{
		"accessToken": "X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X", // This is a special access token that only us developers know. It is always this one.
		"userId": 1, // The user ID
		"messageTitle": "Hello!",
		"messageContent": "Something cool happened"
	}
	```

# Steps to send a quotation-ready notification

1. Open Postman or another HTTP request creation tool
2. Send a POST request to `https://agroxdev.rj.r.appspot.com/send-notification/quotation-ready` with the following JSON body:

	```jsonc
	{
		"accessToken": "X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X", // This is a special access token that only us developers know. It is always this one.
		"userId": 1, // The user ID
		"quotationId": 2, // The quotation ID
		"messageTitle": "Quotation ready!",
		"messageContent": "Your quotation request for Foobar is ready! Click here to see it!"
	}
	```

# Environment variables for API keys and other necessary configurations for the LOCAL developement environment:

1. Create an environment variable called: MAP_STATIC_API_KEY and assign the value from the API credentials for Google Maps Static API available at:

	`https://console.cloud.google.com/apis/credentials?project=agroxdev`

2. Create an environment variable called: NOTIFICATIONS_SERVER_KEY and assign the value from the API for notifications the value can be found at:

	`https://scm.oktobyatech.com.br/pbarbosa/agro-x/-/settings/ci_cd`

3. Create an environment variable called: NOTIFICATIONS_EXPERIENCE_ID and assign the constant value that can be found at:

	`https://scm.oktobyatech.com.br/pbarbosa/agro-x/-/settings/ci_cd`

4. Create an environment variable called: GCP_PROJECT_ID and assign the constant value that can be found at:

	`https://scm.oktobyatech.com.br/pbarbosa/agro-x/-/settings/ci_cd`

5. Create an environment variable called: GOOGLE_APPLICATION_CREDENTIALS and assign the path of the JSON key file that can be downloaded from:

   `https://console.cloud.google.com/iam-admin/serviceaccounts/details/105539878192832929345;edit=true?previousPage=%2Fapis%2Fcredentials%3Fproject%3Dagroxdev&project=agroxdev`

- [x] Click in Add Key
- [x] Select Create New Key and select the JSON type
- [x] Save the JSON file in your development environment and use the path to this file (including filename) to assing to the GOOGLE_APPLICATION_CREDENTIALS value.


# Tiles Generation:

## Creating Tiles for Farm Maps

There is already a VM created on gcloud to run the `tileprocess.sh` script. The VM is called `tile-processor`.
1. To run the script and generate tiles for a given farm based on images for a given date.
2. The GeoTiff files for the farm must be placed on the `agroxdev-field-images` bucket
	under the farm-id-X and `YYYY-MM-DD`folder.
3. On the tile-processor VM open the OPT path: cd /opt
4. Run the following command to generate tiles for the farm: `sudo bash tileprocess.sh <farm-id> <YYYY-MM-DD>`.
5. The processing will take a while. The script will output tiles to the following bucket: `agroexplore-field-map` under the path <farm-id>/<YYYY-MM-DD>.
6. The script will add an entry to the `imaging` table pointing to this new tile path.

```
IMPORTANT: After the process is finished stop the VM to save $$$.
```

## Computer VM on Gcloud Environment:

If is necessary to create the VM from scratch here follows the steps to configure it.

1. Create a VM with c2-standard-8 processing (or any other high compute power configuration) select a high capacity disk space (1000Gb at least), use Ubuntu 20 or higher image.

2. Install QGIS following the steps below:

```
Instructions from: https://www.qgis.org/pt_BR/site/forusers/alldownloads.html
First install some tools you will need for this instructions:

sudo apt install gnupg software-properties-common
Now install the QGIS Signing Key, so QGIS software from the QGIS repo will be trusted and installed:

wget -qO - https://qgis.org/downloads/qgis-2020.gpg.key | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/qgis-archive.gpg --import
sudo chmod a+r /etc/apt/trusted.gpg.d/qgis-archive.gpg
Add the QGIS repo for the latest stable QGIS (3.18.x Zürich).

Note: “lsb_release -c -s” in those lines will return your distro name:

sudo add-apt-repository "deb https://qgis.org/debian `lsb_release -c -s` main"
Update your repository information to reflect also the just added QGIS one:

sudo apt update
Now, install QGIS:

sudo apt install qgis qgis-plugin-grass
```

3. Install Node 12 following the steps below:

```
Instructions from: https://github.com/nodesource/distributions/blob/master/README.md
Node.js v12.x:
# Using Ubuntu
sudo curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -fsSL https://deb.nodesource.com/setup_12.x | bash -
apt-get install -y nodejs
```

4. Install YARN `sudo npm install --global yarn`

5. On the OPT path (/opt) clone the project repo: `sudo git clone https://scm.oktobyatech.com.br/pbarbosa/agro-x.git`

6. The VM must have access to the `agroxdev-field-images` bucket wich resides on the development environment (the VM is set on the production environment). In order for the VM to access this bucket the VM user must be added to the permission list of the bucket.

7. Create DB URL (for dev and prod) environment variables files at the /opt path.
-[x] the production environment URL must be placed in one line at a file named: env_db_prod
-[x] the development environment URL must be placed in one line at a file named: env_db_dev


