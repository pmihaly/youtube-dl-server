const fs = require('fs');
const path = require('path');
const request = require('supertest');
const dotenv = require('dotenv').config();
const chai = require('chai');
const app = require('../server');

chai.use(require('chai-fs'));

const TEST_VIDEO = { title: 'City Morgue - Toxic Boogaloo EP REVIEW', id: 'CH0ix7D-vr0' };

describe('GET /ping', () => {
  const req = request(app).get('/ping');

  it('responds with a json', (done) => {
    req.expect('Content-Type', /json/).expect(200, done());
  });

  it("responds with 'pong'", (done) => {
    req.expect(200, { result: 'pong' }, done());
  });
});

describe('GET /:videoId', () => {
  const req = request(app).get(`/${TEST_VIDEO.id}`);
  const videoPath = `${path.join(process.env.DL_PATH, TEST_VIDEO.title)}.mkv`;

  it('responds correctly', (done) => {
    req.expect('Content-Type', /json/).expect(
      200,
      {
        success: true,
        videoPath,
      },
      done
    );
  });

  it('writes video to filesystem', (done) => {
    chai.expect(videoPath).to.be.a.path();
    done();
  });
});