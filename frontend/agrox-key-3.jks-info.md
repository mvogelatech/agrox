# Info about how `agrox-key-3.keystore` was generated

Note: this markdown file is just for reference. It can be edited freely, renamed and even deleted.

The file `agrox-key-3.jks` was generated at `2020-08-06T14:50:00.000Z` with validity of 100 thousand days, as follows:

```
C:\Users\pabarbo>keytool -genkeypair -v -keystore agrox-key-3.keystore -alias agrox-key-3-alias -keyalg RSA -keysize 2048 -validity 100000
Enter keystore password: *****************************************
Re-enter new password: *****************************************
What is your first and last name?
  [Unknown]:  Pedro Barbosa
What is the name of your organizational unit?
  [Unknown]:  Embraer Atech
What is the name of your organization?
  [Unknown]:  Embraer Atech
What is the name of your City or Locality?
  [Unknown]:  Sao Paulo
What is the name of your State or Province?
  [Unknown]:  Sao Paulo
What is the two-letter country code for this unit?
  [Unknown]:  BR
Is CN=Pedro Barbosa, OU=Embraer Atech, O=Embraer Atech, L=Sao Paulo, ST=Sao Paulo, C=BR correct?
  [no]:  yes

Generating 2.048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 100.000 days
        for: CN=Pedro Barbosa, OU=Embraer Atech, O=Embraer Atech, L=Sao Paulo, ST=Sao Paulo, C=BR
Enter key password for <agrox-key-3-alias>
        (RETURN if same as keystore password):
[Storing agrox-key-3.keystore]
```

Then it was renamed from `agrox-key-3.keystore` to `agrox-key-3.jks`.

## Notes

* I followed [this guide](https://levelup.gitconnected.com/build-your-standalone-expo-app-locally-with-turtle-cli-87de3a487704)

* The password for `agrox-key-3-alias` is the same as the keystore password.

* The password was redacted from this file for security reasons. Contact me if the password is necessary for something.

* To obtain the MD5, SHA-1 and SHA-256 fingerprints, run:

  ```
  keytool -list -v -keystore agrox-key-3.jks -alias agrox-key-3-alias
  ```
