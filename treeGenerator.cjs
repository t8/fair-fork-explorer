const Arweave = require("arweave");

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});
const jwk = {"kty":"RSA","ext":true,"e":"AQAB","n":"tRM7uG4jBJTa-t8IiLyZvYkVpCB-R1TdfSfMpOTcqU7HvFkKPAc5YrMTc9JUobgbBz2pyILNUOm9wQqKWsmPlZWVW7yTmMiyOZrwrTYUpSUkvf46cfut3HS7DcKjOJciI_fy2PAvV-4Phqk0ML6hT8ybAmfK4iIlDESdQJ_d-ZdYnQOGaOPM7tP60Lyi9gPbfF93bjLDTXbaZvLKAOatBsEt8f6SRZkucDD77h0jltDzdOLnmqxrh_cR4JNmWHjv2yvOTXykMQCErz8SUO9A0BEA8Rh1t0zwnFvHuo_WXIqn1y1mEtWBiOJ7cmv9xU-KXy4A_qRwt5FoNw5cau2aMJqF6vqAAaRJ7jgd0lxXNIDjyJTTlO4wVZyHX5eABdwGXldA09rNHlljbuBzvSkzmKtE1fWHfCD_4zcDbEXEGggjGzVnZ62j3eIAOsHGLksKY958kXc9xzhBxDnEqBxp2uziXovX9nqqMSsJNLgFIRDoVRUG8Ey6Tj6xo1OSqn7Mruv_p2OMSwlgJOhpELnPvR2814KiB-7_eaFp_ZrKacI75ZIXWm5JeyJ5UMv3DpTVLOtGpQiDUF1jGanZbjRCFWIBDUjVNh6deKaKwsWP4eUNQVdjhZcqOBvz1pj4dJDjc_BjreG6d6vRyjys6c9HqDSQ8JvMDs7bK9ULLearuf0","d":"bnnymN7RjK0JQcCsI0j2f_ZQdtfAU-MKU57hs8VSgBXptReaL--0amyZtLOiIR0DmJJdsVFk1TYXKN02dpe9e-VMwDC42KGyY4UNzJBPXkbgOO8QV5TXicbKjWWwUgmbsdhImWVJbVt4q482oXrdTqOl-3y6AugUNHz0eIZRV0Oos_t_mSVLVneM8qf0wSavVh2k714XXH7kV6VP6-bRsGpSju_j7IS-GYM5YhjzKsQHlcwOxIboAIeUp7Em41m99bmvYAVo4-DOE2Hm2exvXcLSEUb8Iz7VGoDAximV_tY1-wne2iTbqFmOOcx7g1O5N8MIplRL1SPpMpYXesHGrVQQ6_SzSzF_ly31r-R-GnS6YSNEkU7TRIUlTSw1tGuMDP8Z7AptUPBY4l-Ly_UdOI2CvsiAZDbKWJgXanzX8swQvrYg3IYE6Zwq9pVutnyAC94lj06aN5C4zoM4wsAunFwKTbsby9hwd6eoj7_RpD9orYNdF-XFOdXVR-v0sXCl2vL_6UM9tZBvJ46gCmEkHJXvQJCdFoFFSIGJKhuTiCX9PUYYqZUIu5Jgv8Jl2ZrhOqkgOiv35ZOP5Eq49QINJxNwxnpwYd0-rXhc_Y8_tOyyEXryGhI0vf3Xd-7d-9WuKnmg88ZieEe36kgNghhkx6JZgtgCW54KDLedtAlRNT0","p":"16SZk9-JKzHnlNQ6ijr2Dxe3s4WD_2hs0DCuYBAInaTPM6bqXaT7Xrf490gj1tF2HJacB4hBLVAQq8dRGen6mlvVoRi5OXpEP5nN03saLBiqoN8EN8O9qyTMVlMpPwqabGU8T_AoyPz19NhYx2Ug1q46tECHRaoYwnqqb3JoizocWq7BhAi9LZkppXbdbsHHjvwOtvhMKNpGEwHr_tLObwR7Tr6KZkucrba4MMWSt79NtHSN6WYrcQd4ORoJk5GuHBGJR9BaNfBOO-HulCYJngqawiKP5Oh_Muiyt87T5EKmCeZDutYsvOXbG9gu2Qq5C9DcaR6_RhHVQ6NFKmqogw","q":"1vZ_OayKMJaKGEXjEss3KN_1hLwJV-eWE5eUG6OWq1CfDfFCVTDShbmCXfzIBYCOD9CptSYiEi2H90Z2JdMYYTNbykG4BQvJWdgsEm0w7IWcPJANdh4rDi1BKEe7nhNcX7EDi27Hec6tRQe9hQr_VK6iNgqh8HzXSu9JPwKznHC9CSNJGlolB_SkumKtfqEOXdvlNDDa-8EEnxY98pGCaPTfjYt1KfRTVMp4XoOLHAWoV-IlSEssi6wadGU5L_YCbnujnHukDOKLWUYmL-GvEacdTXqm1F6yxEWGbFNi0QT2Y_R74mj9sy337OO_2PeQY9fyIKCZEDf13KNH40GLfw","dp":"cxyCftVMu6ogHOpNdYyT3OqkPUiAdc6gh2H1M4JblwtrL_9iDCsNpDpAxH_V4c5eZlRfZgXuBOpAe_Ih8Ntd0xhCqYQxG-WQmQLZRJLqHa_tJYLnFX1_ueQiz9IEqopWdJZ145Ynr2KZSOJUQdxR80d-PspTa3SpUud4I5XHCMs0Z5Px6TFhCv4_pPwWqBD5HfKfSDyzKvuZfHwCJj0RxWF3EUnVR1YFhRWMrTxKXZvZNwMg3f6UIfoCyziC9CtH7ePOjG9EOJbWrFCmsp67c4nloswgU-loPRzKiiP2KFsLly076nh52Tw6AlscZu-6Z_xOLC8lm5nZZgm52jKlUQ","dq":"TNWkmffLGRzl1VE9nd0XJTwP5NbVPB9h7DTU0qBBXZCemXwvqoWd6gBp0bBlylmt7Yc28bHkoby2ibMczd5LK4sQ9xVQcjVJThzPe_Kddx02wAr5VMvptdKFJKGnNRRUgzuhObhqAmbWVgMzQZexthIJlulsAqqMxZMMCkKr8nH1j4uWOJ4Z-GMAckKNIuLsYK4VmfcQfsX6IebwU4ChLWTBdzVutoVHN9p69cVs9qIrDuadTt7X2EC23_3CWBtFuTnmPCuRcq2TA2Doi1rOma-y8Juzf9staKw1JQkVHAL7ErUzhrTiYaY_pOOvEh1C9f0c5X6h10M5VRjjvB4Ufw","qi":"oZif6JrzakCsPNso-tKkU7ZH6-NnjOy2bMjTVhdUuYZ9tDQYhz_HJCsm-_DLJ-SN-vLLAB61OlP4LOs2z5VcfA2KZtZJ8hFlDfaokImtM2s03nC0F5YhsgCsA74ubWk_UEKUGwUHK0rj9g94ZFrr2_Us8OeT7zLlxNwiu8HvfZ9FB85zhLXqHFm82f3Qncv6EXqVc9GG8bQ_Y8IyR9_pHqjHRn_9VWPVd0X1Qr8vQWn4jwqIEvtx0YRTmMKuDXTcF8npABugT9w2uLcACU0g3txu8kC7TKUuB8veoObRG6Z_BL3TyCAAGevUmt35S_drYXSeXH10vXTu-367odl1Yg"};

async function generateTree() {
  const forkOrigin = await generateFork("");
  const fork1 = await generateFork(forkOrigin);
  const fork2 = await generateFork(forkOrigin);
  const fork3 = await generateFork(fork1);
  const fork4 = await generateFork(fork3);
  const fork5 = await generateFork(fork2);

  console.log(`FORKS:\n\n
  ORIGIN: ${forkOrigin}\n
  FORK 1: ${fork1}\n
  FORK 2: ${fork2}\n
  FORK 3: ${fork3}\n
  FORK 4: ${fork4}\n
  FORK 5: ${fork5}\n`);
}

async function generateFork(forkedFrom) {
  let txData;
  if (forkedFrom !== "") {
    txData = `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Hello world!</title>
      </head>
      <body>
        <h1>Fair fork permapage</h1>
        <p>This permapage is a fork of: ${forkedFrom}</p>
        <p>(But the content could be anything here!)</p>
      </body>
    </html>`;
  } else {
    txData = `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Hello world!</title>
      </head>
      <body>
        <h1>Fair fork permapage</h1>
        <p>This is an original piece of data that was not forked from anything.</p>
      </body>
    </html>`;
  }
  const tx = await arweave.createTransaction({
    data: txData
  }, jwk);

  tx.addTag('Content-Type', 'text/html');
  if (forkedFrom !== "") {
    tx.addTag('Forked', forkedFrom);
  }

  await arweave.transactions.sign(tx, jwk);
  try {
    await arweave.transactions.post(tx, jwk);
  } catch (err) {
    throw new Error(err);
  }

  console.log(`POSTED TX: ${tx.id}`);
  return tx.id;
}

generateTree();