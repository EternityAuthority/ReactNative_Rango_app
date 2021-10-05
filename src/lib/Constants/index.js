export const HEALTH_AWARD_SECONDS_GAP = 10800;
export const MAX_HEALTH = 5;
export const cloudFunctionsLink =
  'https://us-central1-langoo-752eb.cloudfunctions.net/app';
export const healthURL = cloudFunctionsLink + '/health/daily-award';
export const healthPurchaseByGemsURL =
  cloudFunctionsLink + '/health/purchase-by-gems';
export const consumeDealURL = cloudFunctionsLink + '/purchases/consume-deal';
export const claimDailyChest = cloudFunctionsLink + '/purchases/claim-daily-chest';
export const claimTrial = cloudFunctionsLink + '/purchases/claim-pro-trial';
export const recieptValidationURL = cloudFunctionsLink + '/validation/reciept';
export const QUESTION_TYPES = {
  to_know: 'to_know',
  choose_correct_one: 'choose_correct_one',
  translate_this_word: 'translate_this_word',
  arrange_sentence: 'arrange_sentence',
  fill_in_the_blanks: 'fill_in_the_blanks',
  listen_and_choose: 'listen_and_choose',
  listen_and_arrange: 'listen_and_arrange',
  listen_and_write: 'listen_and_write',
  listen_and_record: 'listen_and_record',
  choose_audio: 'choose_audio',
};

export const QUIZ_MODE = {
  REPEAT: 'repeat',
  TEST: 'test',
};

export const UNIT_PASS_NO = 6;
